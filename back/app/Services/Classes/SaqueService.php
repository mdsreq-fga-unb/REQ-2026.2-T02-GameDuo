<?php

namespace App\Services\Classes;

use App\Jobs\EnviarSaque;
use App\Models\MovimentoRecebimento;
use App\Models\Provedor;
use App\Models\Saque;
use App\Models\Usuario;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SaqueService
{
    private const FINAIS = [
        'DONE' => Saque::PAGO,
        'FAILED' => Saque::FALHOU,
        'CANCELLED' => Saque::FALHOU,
    ];

    public function __construct(
        private AsaasService $asaas,
        private RecebimentoService $recebimento,
    ) {
    }

    public function listar(Usuario $usuario): Collection
    {
        return Saque::where('email', $usuario->email)->latest('id')->get();
    }

    // RF28: reserva o valor e só depois fala com o Asaas
    public function solicitar(Usuario $usuario, int $centavos): Saque
    {
        $saque = DB::transaction(function () use ($usuario, $centavos) {
            // dois pedidos simultâneos não podem usar o mesmo saldo (RN41)
            Usuario::lockForUpdate()->findOrFail($usuario->email);
            $provedor = Provedor::findOrFail($usuario->email);

            abort_unless(
                $provedor->recebimentoCompleto(),
                422,
                'Complete seus dados de recebimento (chave Pix, tipo e CPF) antes de sacar.'
            );

            $minimo = (int) round(config('gameduo.saque_minimo') * 100);
            if ($centavos < $minimo) {
                throw ValidationException::withMessages([
                    'valor' => 'O valor mínimo de saque é R$ '.number_format($minimo / 100, 2, ',', '.').'.',
                ]);
            }
            if ($centavos > $this->recebimento->disponivel($usuario->email)) {
                throw ValidationException::withMessages([
                    'valor' => 'O valor é maior que o saldo disponível para saque.',
                ]);
            }

            $saque = Saque::create([
                'email' => $usuario->email,
                'centavos' => $centavos,
                'chave_pix' => $provedor->dados,
                'tipo_chave' => $provedor->tipo_chave,
                'status' => Saque::SOLICITADO,
                'referencia' => (string) Str::uuid(),
            ]);

            $this->lancar($saque, MovimentoRecebimento::SAQUE, -$centavos, $usuario->email);

            return $saque;
        });

        EnviarSaque::dispatch($saque->id);

        return $saque->refresh();
    }

    // Chamado pelo job. A troca de status é a trava: um saque só é enviado uma vez.
    public function enviar(int $saqueId): void
    {
        $assumiu = Saque::whereKey($saqueId)
            ->where('status', Saque::SOLICITADO)
            ->update(['status' => Saque::PROCESSANDO]);

        if (! $assumiu) {
            return;
        }

        $saque = Saque::findOrFail($saqueId);

        try {
            $resposta = $this->asaas->transferirPix(
                $saque->centavos / 100,
                $saque->chave_pix,
                $saque->tipo_chave,
                $saque->referencia,
            );
        } catch (RequestException $exception) {
            report($exception);

            // 4xx: o Asaas recusou, nada foi transferido. 408 e 5xx: não dá para saber.
            $recusado = $exception->response->clientError() && $exception->response->status() !== 408;
            $recusado
                ? $this->finalizar($saqueId, Saque::FALHOU, 'O provedor de pagamentos recusou a transferência.', 'sistema')
                : $this->marcarVerificacao($saqueId);

            return;
        } catch (ConnectionException $exception) {
            report($exception);
            $this->marcarVerificacao($saqueId);

            return;
        }

        $this->aplicarRetorno($saqueId, $resposta);
    }

    // Aviso TRANSFER_* do Asaas
    public function receberAviso(array $transferencia): void
    {
        $saque = Saque::query()
            ->when(
                filled($transferencia['externalReference'] ?? null),
                // string inválida em coluna uuid derruba a consulta no Postgres
                fn ($q) => Str::isUuid($transferencia['externalReference'])
                    ? $q->where('referencia', $transferencia['externalReference'])
                    : $q->whereRaw('1 = 0'),
                fn ($q) => $q->where('asaas_id', $transferencia['id'] ?? ''),
            )
            ->first();

        if ($saque) {
            $this->aplicarRetorno($saque->id, $transferencia);
        }
    }

    // Encerra o saque uma única vez; falha devolve o valor ao saldo
    public function finalizar(int $saqueId, string $status, ?string $motivo = null, string $autor = 'asaas'): bool
    {
        return DB::transaction(function () use ($saqueId, $status, $motivo, $autor) {
            $saque = Saque::lockForUpdate()->findOrFail($saqueId);

            if (! in_array($saque->status, Saque::EM_ANDAMENTO, true)) {
                return false;
            }

            $saque->update([
                'status' => $status,
                'motivo_falha' => $status === Saque::FALHOU ? mb_substr($motivo ?? 'Transferência não concluída.', 0, 250) : null,
                'resolvido_por' => $autor,
                'finalizado_em' => now(),
            ]);

            if ($status === Saque::FALHOU) {
                $this->lancar($saque, MovimentoRecebimento::ESTORNO_SAQUE, $saque->centavos, $autor);
            }

            return true;
        });
    }

    private function aplicarRetorno(int $saqueId, array $transferencia): void
    {
        if (filled($transferencia['id'] ?? null)) {
            Saque::whereKey($saqueId)->whereNull('asaas_id')->update(['asaas_id' => $transferencia['id']]);
        }

        $final = self::FINAIS[$transferencia['status'] ?? ''] ?? null;
        if ($final) {
            $this->finalizar($saqueId, $final, $transferencia['failReason'] ?? null);
        }
    }

    private function marcarVerificacao(int $saqueId): void
    {
        Saque::whereKey($saqueId)->where('status', Saque::PROCESSANDO)->update(['status' => Saque::VERIFICACAO]);
    }

    private function lancar(Saque $saque, string $tipo, int $centavos, string $autor): void
    {
        MovimentoRecebimento::create([
            'email' => $saque->email,
            'tipo' => $tipo,
            'centavos' => $centavos,
            'descricao' => $tipo === MovimentoRecebimento::SAQUE ? 'Saque Pix' : 'Saque não concluído',
            'saque_id' => $saque->id,
            'disponivel_em' => now(),
            'autor' => $autor,
            'chave' => "{$tipo}:{$saque->id}",
        ]);
    }
}
