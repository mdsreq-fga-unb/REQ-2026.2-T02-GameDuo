<?php

namespace App\Jobs;

use App\Services\Classes\CarteiraService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

// Credita as moedas fora do request do webhook, para o Asaas receber o 200 na hora.
class CreditarMoedas implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public array $backoff = [10, 60, 300];

    public function __construct(public int $cobrancaId)
    {
    }

    public function handle(CarteiraService $carteira): void
    {
        $carteira->creditarCompra($this->cobrancaId);
    }
}
