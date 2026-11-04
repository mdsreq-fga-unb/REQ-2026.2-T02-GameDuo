<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUsuariosRequest;
use App\Models\Oferta;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;

// RF44: o administrador só CONSULTA usuários (sem editar, banir ou sancionar).
// Nunca devolve senha nem dados de recebimento (chave Pix).
class AdminUsuarioController extends Controller
{
    public function index(AdminUsuariosRequest $request): JsonResponse
    {
        $filtros = $request->validated();
        $busca = mb_strtolower(trim($filtros['busca'] ?? ''));
        $tipo = $filtros['tipo'] ?? 'todos';

        $resultado = Usuario::query()
            ->select(['email', 'nickname'])
            ->withExists('provedor')
            ->when($busca !== '', function ($query) use ($busca) {
                // LOWER(...) LIKE funciona igual no Postgres (Supabase) e no SQLite (testes)
                $query->where(function ($query) use ($busca) {
                    $query->whereRaw('LOWER(nickname) LIKE ?', ["%{$busca}%"])
                        ->orWhereRaw('LOWER(email) LIKE ?', ["%{$busca}%"]);
                });
            })
            ->when($tipo === 'prestadores', fn ($query) => $query->has('provedor'))
            ->when($tipo === 'consumidores', fn ($query) => $query->doesntHave('provedor'))
            ->orderBy('nickname')
            ->orderBy('email')
            ->paginate($filtros['por_pagina'] ?? 20, ['*'], 'pagina', $filtros['pagina'] ?? 1);

        return response()->json([
            'itens' => $resultado->getCollection()->map(fn (Usuario $usuario) => [
                // o e-mail é a chave do usuário: o front usa para abrir o detalhe
                'email' => $usuario->email,
                'email_mascarado' => $usuario->emailMascarado(),
                'nickname' => $usuario->nickname,
                'presta_servico' => (bool) $usuario->provedor_exists,
            ]),
            'total' => $resultado->total(),
            'pagina' => $resultado->currentPage(),
            'por_pagina' => $resultado->perPage(),
            'ultima_pagina' => $resultado->lastPage(),
        ]);
    }

    public function show(string $email): JsonResponse
    {
        $usuario = Usuario::with('provedor')->find(mb_strtolower($email));

        if (! $usuario) {
            return response()->json([
                'message' => 'Usuário não encontrado.',
            ], 404);
        }

        $ofertas = Oferta::where('email', $usuario->email);

        return response()->json([
            'email' => $usuario->email,
            'nome' => $usuario->nome,
            'nickname' => $usuario->nickname,
            'role' => $usuario->role,
            'presta_servico' => $usuario->ehPrestador(),
            'jogos' => (clone $ofertas)->distinct()->orderBy('jogo')->pluck('jogo'),
            'ofertas_ativas' => $ofertas->count(),
            // só diz SE existe; a chave Pix em si nunca sai daqui
            'dados_recebimento_cadastrados' => filled($usuario->provedor?->dados),
        ]);
    }
}
