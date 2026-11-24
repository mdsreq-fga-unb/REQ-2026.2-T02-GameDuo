<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecuperacaoSenhaRequest;
use App\Services\Classes\RecuperacaoSenhaService;
use Illuminate\Http\JsonResponse;

class RecuperacaoSenhaController extends Controller
{
    public function __construct(private RecuperacaoSenhaService $service)
    {
    }

    public function solicitar(RecuperacaoSenhaRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        // depois da resposta: o tempo de envio não revela se a conta existe
        dispatch(fn () => app(RecuperacaoSenhaService::class)->solicitar($email))->afterResponse();

        return response()->json([
            'message' => 'Se o e-mail estiver cadastrado, o código chega em instantes.',
        ]);
    }

    public function validar(RecuperacaoSenhaRequest $request): JsonResponse
    {
        return $this->service->conferir($request->validated('email'), $request->validated('codigo'))
            ? response()->json(['message' => 'Código válido.'])
            : $this->codigoInvalido();
    }

    public function redefinir(RecuperacaoSenhaRequest $request): JsonResponse
    {
        $dados = $request->validated();

        return $this->service->redefinir($dados['email'], $dados['codigo'], $dados['senha'])
            ? response()->json(['message' => 'Senha alterada com sucesso.'])
            : $this->codigoInvalido();
    }

    private function codigoInvalido(): JsonResponse
    {
        $mensagem = 'Código inválido, expirado ou já utilizado. Peça um novo.';

        return response()->json(['message' => $mensagem, 'errors' => ['codigo' => [$mensagem]]], 422);
    }
}
