<?php

use App\Http\Controllers\Api\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'GameDuo API']);
});

Route::post('/login', [LoginController::class, 'login'])
    ->middleware('throttle:5,1');