<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CadastroUsuarioRequest;
use App\Services\Classes\CadastroUsuarioService;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Throwable;

class UsuarioController extends Controller
{
    public function store(
        CadastroUsuarioRequest $request,
        CadastroUsuarioService $service
    ): JsonResponse {
        try {
            $usuario = $service->cadastrar($request->validated());
            
            return response()->json([
                'message' => 'Conta criada com sucesso!',
                'usuario' => [
                    'email' => $usuario->email,
                    'nome' => $usuario->nome,
                    'nickname' => $usuario->nickname,
                ],
            ], 201);
        } catch (UniqueConstraintViolationException $exception) {
            // duas requisições simultâneas com o mesmo e-mail passaram pela validação
            return response()->json([
                'message' => 'Este e-mail já está cadastrado.',
                'errors' => ['email' => ['Este e-mail já está cadastrado.']],
            ], 422);
        } catch (Throwable $exception) {
            report($exception);
            
            return response()->json([
                'message' => 'Não foi possível criar a conta. Tente novamente.',
            ], 500);
        }
    }
} 