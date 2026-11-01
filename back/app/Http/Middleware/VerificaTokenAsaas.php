<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Confere o token que o Asaas manda no header de cada webhook.
class VerificaTokenAsaas
{
    public function handle(Request $request, Closure $next): Response
    {
        $esperado = (string) config('asaas.webhook_token');
        $recebido = (string) $request->header('asaas-access-token');

        // sem token configurado, recusa tudo em vez de aceitar qualquer um
        if ($esperado === '' || ! hash_equals($esperado, $recebido)) {
            return response()->json(['message' => 'Token inválido.'], 401);
        }

        return $next($request);
    }
}
