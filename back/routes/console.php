<?php

use App\Jobs\EnviarSaque;
use App\Models\Saque;
use App\Models\Usuario;
use App\Services\Classes\ContratacaoService;
use App\Services\Classes\SaqueService;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Symfony\Component\HttpKernel\Exception\HttpException;

// RN30 (b): conclui as sessões cujo prazo acabou sem problema registrado
Artisan::command('contratacoes:concluir', function (ContratacaoService $service) {
    $this->info($service->concluirVencidas().' contratação(ões) concluída(s).');
})->purpose('Conclui contratações com o prazo de resultado encerrado');

// RN44: a administração decide fora do sistema e executa aqui
Artisan::command('contratacoes:decidir {id} {decisao : liberar ou devolver} {--motivo=} {--admin=}', function (ContratacaoService $service) {
    $admin = Usuario::find(mb_strtolower((string) $this->option('admin')));
    if (! $admin?->ehAdmin()) {
        $this->error('Informe em --admin o e-mail de uma conta de administrador.');

        return 1;
    }
    if (blank($this->option('motivo'))) {
        $this->error('Informe o motivo em --motivo.');

        return 1;
    }
    if (! in_array($this->argument('decisao'), ['liberar', 'devolver'], true)) {
        $this->error('A decisão deve ser liberar ou devolver.');

        return 1;
    }

    try {
        $service->decidir((int) $this->argument('id'), $this->argument('decisao') === 'liberar', $this->option('motivo'), $admin);
    } catch (HttpException $exception) {
        $this->error($exception->getMessage());

        return 1;
    }

    $this->info('Decisão executada.');

    return 0;
})->purpose('Executa a decisão da administração sobre uma contratação em análise');

// Saque em verificação: conferir no painel do Asaas antes de usar
Artisan::command('saques:resolver {id} {resultado : pago ou falhou} {--motivo=} {--admin=}', function (SaqueService $service) {
    $admin = Usuario::find(mb_strtolower((string) $this->option('admin')));
    if (! $admin?->ehAdmin()) {
        $this->error('Informe em --admin o e-mail de uma conta de administrador.');

        return 1;
    }
    if (! in_array($this->argument('resultado'), [Saque::PAGO, Saque::FALHOU], true)) {
        $this->error('O resultado deve ser pago ou falhou.');

        return 1;
    }

    $mudou = $service->finalizar((int) $this->argument('id'), $this->argument('resultado'), $this->option('motivo'), $admin->email);
    $this->info($mudou ? 'Saque atualizado.' : 'Este saque já estava encerrado.');

    return 0;
})->purpose('Encerra manualmente um saque de resultado incerto');

// Recoloca na fila pedidos que nunca chegaram a ser enviados (o envio é único por saque)
Artisan::command('saques:reenfileirar', function () {
    Saque::where('status', Saque::SOLICITADO)
        ->where('created_at', '<', now()->subMinutes(5))
        ->pluck('id')
        ->each(fn ($id) => EnviarSaque::dispatch($id));
})->purpose('Recoloca na fila os saques ainda não enviados');

Schedule::command('contratacoes:concluir')->everyFiveMinutes()->withoutOverlapping();
Schedule::command('saques:reenfileirar')->everyTenMinutes()->withoutOverlapping();
