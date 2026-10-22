<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\Classes\LoginService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
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

            return response()->json([
                'message' => 'Credenciais válidas.',
                'usuario' => [
                    'email' => $usuario->email,
                    'nome' => $usuario->nome,
                    'nickname' => $usuario->nickname,
                ],
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
}