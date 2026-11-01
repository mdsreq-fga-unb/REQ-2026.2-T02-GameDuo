<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\CreditarMoedas;
use App\Models\Cobranca;
use App\Models\WebhookRecebido;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Grava o aviso, despacha o job e responde 200 na hora. Não credita nada dentro do request:
// se der erro no meio, o Asaas considera falha e reenvia.
class AsaasWebhookController extends Controller
{
    private const PAGAMENTO_APROVADO = ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'];

    private const STATUS_POR_EVENTO = [
        'PAYMENT_OVERDUE' => Cobranca::VENCIDA,
        'PAYMENT_DELETED' => Cobranca::CANCELADA,
    ];

    public function __invoke(Request $request): JsonResponse
    {
        $evento = (string) $request->input('event');

        if (! $request->filled('id')) {
            return response()->json(['message' => 'Aviso sem id.'], 400);
        }

        try {
            WebhookRecebido::create([
                'evento_id' => $request->input('id'),
                'tipo' => $evento,
                'payload' => $request->all(),
            ]);
        } catch (UniqueConstraintViolationException) {
            return response()->json(['message' => 'Aviso já processado.']);
        }

        $cobranca = Cobranca::where('asaas_id', $request->input('payment.id'))->first();

        if ($cobranca && in_array($evento, self::PAGAMENTO_APROVADO, true)) {
            CreditarMoedas::dispatch($cobranca->id);
        } elseif ($cobranca && isset(self::STATUS_POR_EVENTO[$evento])) {
            Cobranca::whereKey($cobranca->id)
                ->where('status', Cobranca::PENDENTE)
                ->update(['status' => self::STATUS_POR_EVENTO[$evento]]);
        }

        return response()->json(['message' => 'Recebido.']);
    }
}
