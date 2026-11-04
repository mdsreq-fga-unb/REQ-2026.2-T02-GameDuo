<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JogoRequest;
use App\Models\CatalogoJogo;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;

// RF50: o admin cadastra, edita e ativa/desativa jogos. Não há exclusão.
class AdminJogoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'jogos' => CatalogoJogo::orderBy('nome')->get()->map->resumo(),
        ]);
    }

    public function store(JogoRequest $request): JsonResponse
    {
        $dados = $request->validated();

        if (CatalogoJogo::comNome($dados['nome'])->exists()) {
            return $this->nomeRepetido();
        }

        try {
            $jogo = CatalogoJogo::create($dados);
        } catch (UniqueConstraintViolationException) {
            // dois cadastros iguais ao mesmo tempo passaram pela checagem acima
            return $this->nomeRepetido();
        }

        return response()->json([
            'message' => 'Jogo salvo com sucesso!',
            'jogo' => $jogo->resumo(),
        ], 201);
    }

    public function update(JogoRequest $request, int $id): JsonResponse
    {
        $jogo = CatalogoJogo::find($id);

        if (! $jogo) {
            return response()->json(['message' => 'Jogo não encontrado.'], 404);
        }

        $dados = $request->validated();

        if (CatalogoJogo::comNome($dados['nome'])->whereKeyNot($jogo->id)->exists()) {
            return $this->nomeRepetido();
        }

        try {
            $jogo->update($dados);
        } catch (UniqueConstraintViolationException) {
            return $this->nomeRepetido();
        }

        return response()->json([
            'message' => 'Jogo salvo com sucesso!',
            'jogo' => $jogo->resumo(),
        ]);
    }

    // mesmo formato dos erros de validação, para o front mostrar a mensagem no campo
    private function nomeRepetido(): JsonResponse
    {
        return response()->json([
            'message' => 'Já existe um jogo com esse nome.',
            'errors' => ['nome' => ['Já existe um jogo com esse nome.']],
        ], 409);
    }
}
