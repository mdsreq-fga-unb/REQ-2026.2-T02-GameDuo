<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContratacaoRequest;
use App\Http\Requests\ResultadoRequest;
use App\Models\Contratacao;
use App\Services\Classes\ContratacaoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ContratacaoController extends Controller
{
    public function __construct(private ContratacaoService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $usuario = $request->user();

        return response()->json([
            'contratacoes' => $this->service->listar($usuario)->map->resumoPara($usuario),
        ]);
    }

    public function store(ContratacaoRequest $request): JsonResponse
    {
        $dados = $request->validated();

        $contratacao = $this->service->contratar(
            $request->user(),
            $dados['oferta_id'],
            Carbon::parse($dados['inicio'])->utc(),
            $dados['contato'],
            $dados['preco'] ?? null,
        );

        return $this->resposta($request, $contratacao, 'Sessão contratada!', 201);
    }

    public function cancelar(Request $request, Contratacao $contratacao): JsonResponse
    {
        $this->conferirParticipante($request, $contratacao);

        return $this->resposta(
            $request,
            $this->service->cancelar($contratacao, $request->user()),
            'Contratação cancelada. As moedas foram devolvidas ao consumidor.',
        );
    }

    public function resultado(ResultadoRequest $request, Contratacao $contratacao): JsonResponse
    {
        $this->conferirParticipante($request, $contratacao);

        $contratacao = $this->service->registrarResultado(
            $contratacao,
            $request->user(),
            $request->validated('resultado'),
            $request->validated('justificativa'),
        );

        $mensagem = match ($contratacao->status) {
            Contratacao::EM_ANALISE => 'Resultado registrado. O valor fica retido até a análise; envie o relato para '.config('gameduo.email_sac').'.',
            Contratacao::CONCLUIDA => 'Sessão concluída!',
            default => 'Resultado registrado. Falta a outra parte confirmar.',
        };

        return $this->resposta($request, $contratacao, $mensagem);
    }

    // quem não participa não descobre nem que a contratação existe
    private function conferirParticipante(Request $request, Contratacao $contratacao): void
    {
        abort_if($contratacao->papelDe($request->user()) === null, 404, 'Contratação não encontrada.');
    }

    private function resposta(Request $request, Contratacao $contratacao, string $mensagem, int $status = 200): JsonResponse
    {
        return response()->json([
            'message' => $mensagem,
            'contratacao' => $contratacao->load(['consumidor', 'prestador'])->resumoPara($request->user()),
        ], $status);
    }
}
