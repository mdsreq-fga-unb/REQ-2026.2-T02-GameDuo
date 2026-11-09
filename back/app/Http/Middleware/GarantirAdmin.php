<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Libera a rota só para contas com papel de administrador (role = 'admin').
// Deve vir depois do auth:api, que já devolve 401 para quem não tem token.
class GarantirAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->ehAdmin()) {
            return response()->json([
                'message' => 'Você não tem permissão para acessar esta área.',
            ], 403);
        }

        return $next($request);
    }
}
