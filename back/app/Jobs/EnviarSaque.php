<?php

namespace App\Jobs;

use App\Services\Classes\SaqueService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

// Uma tentativa só: repetir uma transferência de resultado incerto poderia pagar duas vezes.
class EnviarSaque implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public function __construct(public int $saqueId)
    {
    }

    public function handle(SaqueService $service): void
    {
        $service->enviar($this->saqueId);
    }
}
