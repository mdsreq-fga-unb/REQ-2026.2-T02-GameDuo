<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PerfilPrestadorRequest;
use App\Http\Requests\PrestadorRequest;
use App\Http\Requests\RecebimentoRequest;
use App\Models\Oferta;
use App\Models\Provedor;
use App\Services\Classes\PrestadorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PrestadorController extends Controller
{
    // RF07: perfil público. Nunca devolve e-mail, CPF ou chave Pix.
    public function show(string $codigo): JsonResponse
    {
        $provedor = Provedor::with('usuario')->where('codigo', $codigo)->first();
        abort_if($provedor === null, 404, 'Prestador não encontrado.');

        return response()->json([
            'prestador' => [
                ...$provedor->perfil(),
                'nickname' => $provedor->usuario?->nickname,
                'ofertas' => Oferta::ativas()
                    ->with('usuario.provedor')
                    ->where('email', $provedor->email)
                    ->latest('id')
                    ->get()
                    ->map->resumo(),
            ],
        ]);
    }

    public function perfil(Request $request): JsonResponse
    {
        return response()->json(['perfil' => $request->user()->provedor->perfil()]);
    }

    public function atualizarPerfil(PerfilPrestadorRequest $request): JsonResponse
    {
        $provedor = $request->user()->provedor;
        $provedor->update($request->validated());

        return response()->json([
            'message' => 'Perfil atualizado!',
            'perfil' => $provedor->perfil(),
        ]);
    }

    // RF05: só o próprio prestador vê
    public function recebimento(Request $request): JsonResponse
    {
        $provedor = $request->user()->provedor;

        return response()->json([
            'dados' => $provedor->dados,
            'tipo_chave' => $provedor->tipo_chave,
            'cpf_titular' => $provedor->cpf_titular,
        ]);
    }

    public function atualizarRecebimento(RecebimentoRequest $request): JsonResponse
    {
        $request->user()->provedor->update($request->validated());

        return response()->json(['message' => 'Dados de recebimento atualizados!']);
    }

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
