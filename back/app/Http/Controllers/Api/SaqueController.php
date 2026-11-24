<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Classes\SaqueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaqueController extends Controller
{
    public function __construct(private SaqueService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'saques' => $this->service->listar($request->user())->map->resumo(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'valor' => ['required', 'numeric', 'decimal:0,2', 'gt:0', 'max:1000000'],
        ], [
            'valor.required' => 'Informe o valor do saque.',
            'valor.numeric' => 'Informe um valor em reais, como 25,50.',
            'valor.decimal' => 'Use no máximo duas casas decimais.',
            'valor.gt' => 'O valor deve ser maior que zero.',
            'valor.max' => 'O valor é maior que o permitido.',
        ]);

        $saque = $this->service->solicitar($request->user(), (int) round($dados['valor'] * 100));

        return response()->json([
            'message' => 'Saque solicitado! Acompanhe o resultado na carteira.',
            'saque' => $saque->resumo(),
        ], 201);
    }
}
