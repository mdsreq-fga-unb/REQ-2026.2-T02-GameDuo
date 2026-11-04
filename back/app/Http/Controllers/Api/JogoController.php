<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogoJogo;
use Illuminate\Http\JsonResponse;

class JogoController extends Controller
{
    // público: alimenta o filtro do catálogo e o formulário de ofertas (só jogos ativos)
    public function index(): JsonResponse
    {
        return response()->json([
            'jogos' => CatalogoJogo::ativos()->orderBy('nome')->pluck('nome'),
        ]);
    }
}
