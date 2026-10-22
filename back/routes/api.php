<?php

use App\Http\Controllers\Api\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsuarioController;

Route::get('/', function () {
    return response()->json(['message' => 'GameDuo API']);
});

Route::post('/login', [LoginController::class, 'login'])
    ->middleware('throttle:5,1');

Route::post('/usuarios', [UsuarioController::class, 'store'])
    ->middleware('throttle:10,1');