<?php

namespace App\Services\Classes;

use App\Models\Cobranca;
use App\Models\Contratacao;
use App\Models\MovimentoMoeda;
use App\Models\Usuario;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CarteiraService
{
    public function __construct(private RecebimentoService $recebimento)
    {
    }

    public function saldo(Usuario $usuario): int
    {
        return (int) MovimentoMoeda::where('email', $usuario->email)->sum('moedas');
    }

    public function extrato(Usuario $usuario): Collection
    {
        return MovimentoMoeda::where('email', $usuario->email)->latest('id')->get();
    }

    // RF23: cada situação separada, com a contratação de origem e a data prevista
    public function resumo(Usuario $usuario): array
    {
        $retidas = Contratacao::whereIn('status', Contratacao::RETIDAS)
            ->where('consumidor_email', $usuario->email)
            ->orderBy('inicio')
            ->get();

        $pendentes = Cobranca::where('email', $usuario->email)
            ->where('status', Cobranca::PENDENTE)
            ->latest('id')
            ->get();

        $resumo = [
            'saldo' => $this->saldo($usuario),
            'retido' => (int) $retidas->sum('preco'),
            'retidos' => $retidas->map(fn (Contratacao $c) => [
                'contratacao_id' => $c->id,
                'titulo' => $c->titulo,
                'moedas' => $c->preco,
                'status' => $c->status,
                // em análise não tem data: depende da administração
                'liberacao_prevista' => $c->status === Contratacao::AGENDADA ? $c->prazoResultado() : null,
            ])->values(),
            'pendente' => (int) $pendentes->sum('moedas'),
            'pendentes' => $pendentes->map(fn (Cobranca $c) => [
                'cobranca_id' => $c->id,
                'moedas' => $c->moedas,
                'criada_em' => $c->created_at,
            ])->values(),
            'recebimentos' => null,
        ];

        if ($usuario->ehPrestador()) {
            $resumo['recebimentos'] = $this->recebimentos($usuario);
        }

        return $resumo;
    }

    // valores em reais; só para prestadores
    private function recebimentos(Usuario $usuario): array
    {
        $carencia = $this->recebimento->emCarencia($usuario->email);

        $aReceber = Contratacao::whereIn('status', Contratacao::RETIDAS)
            ->where('prestador_email', $usuario->email)
            ->orderBy('inicio')
            ->get();
        $parte = fn (Contratacao $c) => $c->preco * config('gameduo.percentual_prestador') / 100;

        return [
            'disponivel' => $this->recebimento->disponivel($usuario->email) / 100,
            'em_saque' => $this->recebimento->emSaque($usuario->email) / 100,
            'em_carencia' => $carencia->sum('centavos') / 100,
            'carencias' => $carencia->map(fn ($m) => [
                'contratacao_id' => $m->contratacao_id,
                'titulo' => $m->descricao,
                'valor' => $m->centavos / 100,
                'disponivel_em' => $m->disponivel_em,
            ])->values(),
            'a_receber' => $aReceber->sum($parte),
            'previstos' => $aReceber->map(fn (Contratacao $c) => [
                'contratacao_id' => $c->id,
                'titulo' => $c->titulo,
                'valor' => $parte($c),
                'status' => $c->status,
                'conclusao_prevista' => $c->status === Contratacao::AGENDADA ? $c->prazoResultado() : null,
            ])->values(),
            'saque_minimo' => config('gameduo.saque_minimo'),
            'dados_completos' => $usuario->provedor->recebimentoCompleto(),
        ];
    }

    // chamado pelo job CreditarMoedas; o lock e o status impedem crédito em dobro
    // quando o Asaas manda PAYMENT_CONFIRMED e depois PAYMENT_RECEIVED da mesma cobrança
    public function creditarCompra(int $cobrancaId): void
    {
        DB::transaction(function () use ($cobrancaId) {
            $cobranca = Cobranca::lockForUpdate()->find($cobrancaId);

            if (! $cobranca || $cobranca->status === Cobranca::PAGA) {
                return;
            }

            $cobranca->update([
                'status' => Cobranca::PAGA,
                'pago_em' => now(),
            ]);

            MovimentoMoeda::create([
                'email' => $cobranca->email,
                'tipo' => MovimentoMoeda::COMPRA,
                'moedas' => $cobranca->moedas,
                'descricao' => "Compra do pacote {$cobranca->pacote}",
                'cobranca_id' => $cobranca->id,
                'autor' => 'asaas',
                'chave' => "compra:{$cobranca->id}",
            ]);
        });
    }
}
