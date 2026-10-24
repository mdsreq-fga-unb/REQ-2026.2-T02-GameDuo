<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Libera a rota só para usuários com perfil de prestador (linha em Provedor).
class GarantirPrestador
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->ehPrestador()) {
            return response()->json([
                'message' => 'Apenas prestadores podem gerenciar ofertas. Ative seu perfil de prestador.',
            ], 403);
        }

        return $next($request);
    }
}
