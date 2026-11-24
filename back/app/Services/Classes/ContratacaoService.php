<?php

namespace App\Services\Classes;

use App\Models\Contratacao;
use App\Models\MovimentoMoeda;
use App\Models\Oferta;
use App\Models\Provedor;
use App\Models\Usuario;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

// Jornada da contratação: reservar, cancelar, registrar resultado e concluir.
// Toda mudança de estado acontece em transação, com a linha travada.
class ContratacaoService
{
    public function __construct(
        private AgendaService $agenda,
        private CarteiraService $carteira,
        private RecebimentoService $recebimento,
    ) {
    }

    public function listar(Usuario $usuario): Collection
    {
        // mesmo sem o agendador rodando, quem abre a tela vê o estado certo
        $this->concluirVencidas($usuario->email);

        return Contratacao::de($usuario->email)
            ->with(['consumidor', 'prestador'])
            ->latest('inicio')
            ->latest('id')
            ->get();
    }

    // RF16 + RF25: registra a contratação e reserva as moedas, sem aceite do prestador
    public function contratar(Usuario $usuario, int $ofertaId, Carbon $inicio, string $contato, ?int $precoVisto): Contratacao
    {
        return DB::transaction(function () use ($usuario, $ofertaId, $inicio, $contato, $precoVisto) {
            $prestador = Oferta::whereKey($ofertaId)->value('email');
            abort_if($prestador === null, 404, 'Oferta não encontrada.');
            abort_if($prestador === $usuario->email, 422, 'Você não pode contratar a sua própria oferta.');

            // RNF09: uma contratação por vez para cada prestador, em qualquer oferta dele
            Provedor::lockForUpdate()->findOrFail($prestador);
            // RNF13: uma movimentação por vez na carteira do consumidor
            Usuario::lockForUpdate()->findOrFail($usuario->email);

            // relê depois da trava: a oferta pode ter sido encerrada ou alterada
            $oferta = Oferta::lockForUpdate()->find($ofertaId);
            abort_unless($oferta?->ativa() ?? false, 409, 'Esta oferta foi encerrada.');
            abort_if(
                $precoVisto !== null && $precoVisto !== $oferta->preco,
                409,
                'O preço desta oferta mudou. Confira o novo valor e tente de novo.'
            );

            $vaga = $this->agenda->vagaEm($oferta, $inicio);
            abort_if($vaga === null, 409, 'Este horário não está mais disponível. Escolha outro.');
            abort_if(
                $this->carteira->saldo($usuario) < $oferta->preco,
                422,
                'Saldo insuficiente. Compre mais moedas para contratar.'
            );

            $contratacao = Contratacao::create([
                'oferta_id' => $oferta->id,
                'consumidor_email' => $usuario->email,
                'prestador_email' => $oferta->email,
                'titulo' => $oferta->titulo,
                'descricao' => $oferta->descricao,
                'jogo' => $oferta->jogo,
                'modalidade' => $oferta->modalidade,
                'duracao' => $oferta->duracao,
                'preco' => $oferta->preco,
                'comunicacao' => $oferta->comunicacao ?? 'E-mail',
                'condicoes' => $oferta->condicoes,
                // ofertas antigas não têm contato: RN21 exige algum canal, então usa o e-mail
                'contato_prestador' => $oferta->contato ?? $oferta->email,
                'contato_consumidor' => $contato,
                'inicio' => $vaga['inicio'],
                'fim' => $vaga['fim'],
                'status' => Contratacao::AGENDADA,
            ]);

            MovimentoMoeda::create([
                'email' => $usuario->email,
                'tipo' => MovimentoMoeda::CONTRATACAO,
                'moedas' => -$oferta->preco,
                'descricao' => "Reserva: {$oferta->titulo}",
                'contratacao_id' => $contratacao->id,
                'autor' => $usuario->email,
                'chave' => "reserva:{$contratacao->id}",
            ]);

            return $contratacao;
        });
    }

    // RF18: até o horário marcado, com devolução integral
    public function cancelar(Contratacao $contratacao, Usuario $usuario): Contratacao
    {
        return DB::transaction(function () use ($contratacao, $usuario) {
            $atual = Contratacao::lockForUpdate()->findOrFail($contratacao->id);
            abort_unless($atual->status === Contratacao::AGENDADA, 409, 'Esta contratação não pode mais ser cancelada.');
            abort_unless(
                $atual->podeCancelar(),
                409,
                'O horário marcado já passou. Registre o resultado da sessão.'
            );

            $atual->update([
                'status' => Contratacao::CANCELADA,
                'cancelada_em' => now(),
                'cancelada_por' => $atual->papelDe($usuario),
            ]);
            $this->devolver($atual, $usuario->email, 'Cancelamento');

            return $atual;
        });
    }

    // RF31: cada participante informa o resultado uma vez
    public function registrarResultado(Contratacao $contratacao, Usuario $usuario, string $resultado, ?string $justificativa): Contratacao
    {
        return DB::transaction(function () use ($contratacao, $usuario, $resultado, $justificativa) {
            $atual = Contratacao::lockForUpdate()->findOrFail($contratacao->id);
            $papel = $atual->papelDe($usuario);

            abort_if(now()->lt($atual->inicio), 409, 'A sessão ainda não começou.');
            abort_if($atual->{"resultado_{$papel}"} !== null, 409, 'Você já registrou o resultado desta sessão.');
            abort_unless($atual->podeRegistrar($papel), 409, 'O prazo para registrar o resultado terminou.');

            $atual->fill([
                "resultado_{$papel}" => $resultado,
                "justificativa_{$papel}" => $justificativa,
            ]);

            if ($resultado !== Contratacao::OCORREU) {
                // RN30: problema suspende a liberação até a decisão da administração
                $atual->status = Contratacao::EM_ANALISE;
            }
            $atual->save();

            if ($atual->status === Contratacao::AGENDADA
                && $atual->resultado_consumidor === Contratacao::OCORREU
                && $atual->resultado_prestador === Contratacao::OCORREU) {
                $this->concluir($atual, $usuario->email);
            }

            return $atual;
        });
    }

    // RN30 (b): prazo encerrado sem problema. Devolve quantas foram concluídas.
    public function concluirVencidas(?string $email = null): int
    {
        $limite = now()->subHours(config('gameduo.prazo_resultado_horas'));

        $ids = Contratacao::where('status', Contratacao::AGENDADA)
            ->where('fim', '<', $limite)
            ->when($email, fn ($query) => $query->de($email))
            ->pluck('id');

        $total = 0;
        foreach ($ids as $id) {
            $total += DB::transaction(function () use ($id) {
                $atual = Contratacao::lockForUpdate()->find($id);
                if ($atual?->status !== Contratacao::AGENDADA) {
                    return 0;
                }
                $this->concluir($atual, 'sistema');

                return 1;
            });
        }

        return $total;
    }

    // RN44: executa a decisão tomada pela administração fora do sistema
    public function decidir(int $id, bool $liberar, string $motivo, Usuario $admin): Contratacao
    {
        return DB::transaction(function () use ($id, $liberar, $motivo, $admin) {
            $atual = Contratacao::lockForUpdate()->findOrFail($id);
            abort_unless($atual->status === Contratacao::EM_ANALISE, 409, 'Só contratações em análise podem ser decididas.');

            $atual->fill(['decidida_por' => $admin->email, 'motivo_decisao' => $motivo]);

            if ($liberar) {
                $this->concluir($atual, $admin->email);
            } else {
                $atual->status = Contratacao::DEVOLVIDA;
                $atual->save();
                $this->devolver($atual, $admin->email, 'Decisão da administração');
            }

            return $atual;
        });
    }

    // RF26: encerra a retenção e reparte o valor
    private function concluir(Contratacao $contratacao, string $autor): void
    {
        $contratacao->status = Contratacao::CONCLUIDA;
        $contratacao->concluida_em = now();
        $contratacao->save();

        $this->recebimento->dividir($contratacao, $autor);
    }

    private function devolver(Contratacao $contratacao, string $autor, string $motivo): void
    {
        MovimentoMoeda::create([
            'email' => $contratacao->consumidor_email,
            'tipo' => MovimentoMoeda::DEVOLUCAO,
            'moedas' => $contratacao->preco,
            'descricao' => "{$motivo}: {$contratacao->titulo}",
            'contratacao_id' => $contratacao->id,
            'autor' => $autor,
            'chave' => "devolucao:{$contratacao->id}",
        ]);
    }
}
