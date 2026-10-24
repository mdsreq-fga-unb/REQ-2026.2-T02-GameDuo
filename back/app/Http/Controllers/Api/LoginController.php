<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\Classes\LoginService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class LoginController extends Controller
{
    public function login(
        LoginRequest $request,
        LoginService $service
    ): JsonResponse {
        try {
            $dados = $request->validated();

            $usuario = $service->verificar(
                $dados['email'],
                $dados['senha']
            );

            $token = auth('api')->login($usuario);

            return response()->json([
                'message' => 'Login realizado com sucesso.',
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
                'usuario' => $usuario->resumo(),
            ]);
        } catch (AuthenticationException $exception) {
            return response()->json([
                'message' => 'E-mail ou senha inválidos.',
            ], 401);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Não foi possível realizar o login. Tente novamente.',
            ], 500);
        }
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'usuario' => $request->user()->resumo(),
        ]);
    }

    public function logout(): JsonResponse
    {
        // o token entra na blacklist (cache) e deixa de ser aceito
        auth('api')->logout();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }
}
