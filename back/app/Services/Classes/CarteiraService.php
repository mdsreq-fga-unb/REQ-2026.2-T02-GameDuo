<?php

namespace App\Services\Classes;

use App\Models\Cobranca;
use App\Models\MovimentoMoeda;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CarteiraService
{
    public function saldo(Usuario $usuario): int
    {
        return (int) MovimentoMoeda::where('email', $usuario->email)->sum('moedas');
    }

    public function extrato(Usuario $usuario): Collection
    {
        return MovimentoMoeda::where('email', $usuario->email)->latest('id')->get();
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
            ]);
        });
    }
}
