<?php

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

// rotas que exigem o token do login (Authorization: Bearer <token>)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [LoginController::class, 'me']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/prestador', [PrestadorController::class, 'store']);

    // gestão de ofertas: só para quem tem perfil de prestador
    Route::middleware('prestador')->group(function () {
        Route::get('/minhas-ofertas', [OfertaController::class, 'minhas']);
        Route::post('/ofertas', [OfertaController::class, 'store']);
        Route::put('/ofertas/{oferta}', [OfertaController::class, 'update'])->whereNumber('oferta');
        Route::delete('/ofertas/{oferta}', [OfertaController::class, 'destroy'])->whereNumber('oferta');
    });
});
