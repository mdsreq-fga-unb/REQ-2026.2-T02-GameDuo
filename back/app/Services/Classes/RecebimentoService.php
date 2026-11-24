<?php

namespace App\Services\Classes;

use App\Models\Contratacao;
use App\Models\MovimentoRecebimento;
use App\Models\Saque;
use Illuminate\Support\Collection;

// Dinheiro do prestador. Os saldos são sempre a soma de MovimentoRecebimento, em centavos.
class RecebimentoService
{
    // RF27: 70/30. A chave única impede um segundo repasse da mesma sessão (RN25).
    public function dividir(Contratacao $contratacao, string $autor): void
    {
        $total = $contratacao->preco * 100;
        $prestador = intdiv($total * config('gameduo.percentual_prestador'), 100);

        MovimentoRecebimento::create([
            'email' => $contratacao->prestador_email,
            'tipo' => MovimentoRecebimento::REPASSE,
            'centavos' => $prestador,
            'descricao' => $contratacao->titulo,
            'contratacao_id' => $contratacao->id,
            // RN40: a carência conta da conclusão
            'disponivel_em' => $contratacao->concluida_em->copy()->addDays(config('gameduo.carencia_dias')),
            'autor' => $autor,
            'chave' => "repasse:{$contratacao->id}",
        ]);

        MovimentoRecebimento::create([
            'email' => null,
            'tipo' => MovimentoRecebimento::COMISSAO,
            'centavos' => $total - $prestador,
            'descricao' => $contratacao->titulo,
            'contratacao_id' => $contratacao->id,
            'disponivel_em' => $contratacao->concluida_em,
            'autor' => $autor,
            'chave' => "comissao:{$contratacao->id}",
        ]);
    }

    public function disponivel(string $email): int
    {
        return (int) MovimentoRecebimento::where('email', $email)
            ->where('disponivel_em', '<=', now())
            ->sum('centavos');
    }

    // repasses que ainda não completaram a carência
    public function emCarencia(string $email): Collection
    {
        return MovimentoRecebimento::where('email', $email)
            ->where('disponivel_em', '>', now())
            ->orderBy('disponivel_em')
            ->get();
    }

    public function emSaque(string $email): int
    {
        return (int) Saque::where('email', $email)
            ->whereIn('status', Saque::EM_ANDAMENTO)
            ->sum('centavos');
    }
}
