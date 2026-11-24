<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\CreditarMoedas;
use App\Models\Cobranca;
use App\Models\WebhookRecebido;
use App\Services\Classes\SaqueService;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Grava o aviso, despacha o job e responde 200 na hora. Não credita nada dentro do request:
// se der erro no meio, o Asaas considera falha e reenvia.
class AsaasWebhookController extends Controller
{
    private const PAGAMENTO_APROVADO = ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'];

    private const STATUS_POR_EVENTO = [
        'PAYMENT_OVERDUE' => Cobranca::VENCIDA,
        'PAYMENT_DELETED' => Cobranca::CANCELADA,
    ];

    public function __construct(private SaqueService $saques)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        if (! $request->filled('id')) {
            return response()->json(['message' => 'Aviso sem id.'], 400);
        }

        try {
            // aviso e efeito na mesma transação: se o efeito falhar, o reenvio do Asaas não é descartado
            DB::transaction(fn () => $this->processar($request));
        } catch (UniqueConstraintViolationException $exception) {
            // só é repetição se o aviso já estava gravado; outro conflito é erro de verdade
            if (! WebhookRecebido::where('evento_id', $request->input('id'))->exists()) {
                throw $exception;
            }

            return response()->json(['message' => 'Aviso já processado.']);
        }

        return response()->json(['message' => 'Recebido.']);
    }

    private function processar(Request $request): void
    {
        $evento = (string) $request->input('event');

        WebhookRecebido::create([
            'evento_id' => $request->input('id'),
            'tipo' => $evento,
            'payload' => $request->all(),
        ]);

        // RF28: resultado de um saque
        if (str_starts_with($evento, 'TRANSFER_')) {
            $this->saques->receberAviso((array) $request->input('transfer', []));

            return;
        }

        $cobranca = Cobranca::where('asaas_id', $request->input('payment.id'))->first();

        if ($cobranca && in_array($evento, self::PAGAMENTO_APROVADO, true)) {
            CreditarMoedas::dispatch($cobranca->id);
        } elseif ($cobranca && isset(self::STATUS_POR_EVENTO[$evento])) {
            Cobranca::whereKey($cobranca->id)
                ->where('status', Cobranca::PENDENTE)
                ->update(['status' => self::STATUS_POR_EVENTO[$evento]]);
        }
    }
}
