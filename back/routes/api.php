<?php

use App\Http\Controllers\Api\AsaasWebhookController;
use App\Http\Controllers\Api\CarteiraController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdminJogoController;
use App\Http\Controllers\Api\AdminUsuarioController;
use App\Http\Controllers\Api\JogoController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\OfertaController;
use App\Http\Controllers\Api\PrestadorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsuarioController;

Route::get('/', function () {
    return response()->json(['message' => 'GameDuo API']);
});

Route::post('/login', [LoginController::class, 'login'])
    ->middleware('throttle:5,1');

Route::post('/usuarios', [UsuarioController::class, 'store'])
    ->middleware('throttle:10,1');

// catálogo público
Route::get('/ofertas', [OfertaController::class, 'index']);
Route::get('/ofertas/{oferta}', [OfertaController::class, 'show'])->whereNumber('oferta');
Route::get('/jogos', [JogoController::class, 'index']);

// chamado pelo Asaas, sem login: a autenticação é o token no header
Route::post('/webhooks/asaas', AsaasWebhookController::class)->middleware('asaas.webhook');

// rotas que exigem o token do login (Authorization: Bearer <token>)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [LoginController::class, 'me']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/prestador', [PrestadorController::class, 'store']);

    // compra de moedas (Asaas) e carteira do cliente
    Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('throttle:10,1');
    Route::get('/checkout/{cobranca}', [CheckoutController::class, 'show'])->whereNumber('cobranca');
    Route::get('/carteira', [CarteiraController::class, 'saldo']);
    Route::get('/carteira/extrato', [CarteiraController::class, 'extrato']);

    // gestão de ofertas: só para quem tem perfil de prestador
    Route::middleware('prestador')->group(function () {
        Route::get('/minhas-ofertas', [OfertaController::class, 'minhas']);
        Route::post('/ofertas', [OfertaController::class, 'store']);
        Route::put('/ofertas/{oferta}', [OfertaController::class, 'update'])->whereNumber('oferta');
        Route::delete('/ofertas/{oferta}', [OfertaController::class, 'destroy'])->whereNumber('oferta');
    });

    // área administrativa: só contas com role = 'admin'
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/resumo', [AdminController::class, 'resumo']);

        // RF44: consultar usuários (somente leitura)
        Route::get('/usuarios', [AdminUsuarioController::class, 'index']);
        Route::get('/usuarios/{email}', [AdminUsuarioController::class, 'show']);

        // RF50: manter jogos (exclusão só de jogo sem ofertas; os demais se desativam)
        Route::get('/jogos', [AdminJogoController::class, 'index']);
        Route::post('/jogos', [AdminJogoController::class, 'store']);
        Route::put('/jogos/{id}', [AdminJogoController::class, 'update'])->whereNumber('id');
        Route::delete('/jogos/{id}', [AdminJogoController::class, 'destroy'])->whereNumber('id');
    });
});
