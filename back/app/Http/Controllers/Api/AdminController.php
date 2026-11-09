<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogoJogo;
use App\Models\Provedor;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    // totais exibidos nos cards do Painel Administrativo
    public function resumo(): JsonResponse
    {
        return response()->json([
            'total_usuarios' => Usuario::count(),
            'total_prestadores' => Provedor::count(),
            'jogos_ativos' => CatalogoJogo::ativos()->count(),
        ]);
    }
}
