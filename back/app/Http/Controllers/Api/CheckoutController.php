<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Cobranca;
use App\Services\Classes\CheckoutService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(private CheckoutService $service)
    {
    }

    public function store(CheckoutRequest $request): JsonResponse
    {
        $dados = $request->validated();

        try {
            $resultado = $this->service->criar(
                $request->user(),
                $dados['pacote'],
                $dados['forma'],
                $dados['cpf'] ?? null,
            );
        } catch (RequestException|ConnectionException $exception) {
            // RequestException: o Asaas respondeu com erro. ConnectionException: nem chegou (rede, SSL, timeout)
            report($exception);

            return response()->json([
                'message' => 'Não foi possível gerar o pagamento agora. Tente novamente.',
                'detalhes' => $exception instanceof RequestException
                    ? $exception->response->json('errors.*.description')
                    : null,
            ], 502);
        }

        return response()->json([
            'message' => 'Cobrança gerada! Aguardando pagamento.',
            ...$resultado,
        ], 201);
    }

    // a tela de espera consulta aqui enquanto o webhook não chega
    public function show(Request $request, Cobranca $cobranca): JsonResponse
    {
        if (! $this->service->pertenceA($cobranca, $request->user())) {
            return response()->json(['message' => 'Cobrança não encontrada.'], 404);
        }

        return response()->json([
            'cobranca' => $cobranca->resumo(),
        ]);
    }
}
