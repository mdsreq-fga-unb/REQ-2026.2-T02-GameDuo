<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrestadorRequest;
use App\Services\Classes\PrestadorService;
use Illuminate\Http\JsonResponse;
use Throwable;

class PrestadorController extends Controller
{
    public function store(
        PrestadorRequest $request,
        PrestadorService $service
    ): JsonResponse {
        $usuario = $request->user();

        if ($usuario->ehPrestador()) {
            return response()->json([
                'message' => 'Seu perfil de prestador já está ativo.',
            ], 409);
        }

        try {
            $service->ativar($usuario, $request->validated());

            return response()->json([
                'message' => 'Perfil de prestador ativado!',
                'usuario' => $usuario->resumo(),
            ], 201);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Não foi possível ativar o perfil de prestador. Tente novamente.',
            ], 500);
        }
    }
}
