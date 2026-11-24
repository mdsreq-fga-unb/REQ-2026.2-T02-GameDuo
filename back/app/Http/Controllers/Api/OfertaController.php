<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OfertaRequest;
use App\Models\Oferta;
use App\Services\Classes\OfertaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfertaController extends Controller
{
    public function __construct(private OfertaService $service)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'ofertas' => $this->service->listar()->map->resumo(),
        ]);
    }

    public function show(Oferta $oferta): JsonResponse
    {
        abort_unless($oferta->ativa(), 404, 'Oferta não encontrada.');

        return response()->json([
            'oferta' => $oferta->load('usuario.provedor')->resumo(),
        ]);
    }

    public function minhas(Request $request): JsonResponse
    {
        return response()->json([
            'ofertas' => $this->service->listarDoPrestador($request->user())->map->resumoDono(),
        ]);
    }

    public function store(OfertaRequest $request): JsonResponse
    {
        $oferta = $this->service->criar($request->user(), $request->validated());

        return response()->json([
            'message' => 'Oferta publicada! Configure a agenda para receber contratações.',
            'oferta' => $oferta->resumoDono(),
        ], 201);
    }

    public function update(OfertaRequest $request, Oferta $oferta): JsonResponse
    {
        if (! $this->service->pertenceA($oferta, $request->user())) {
            return $this->semPermissao();
        }

        abort_unless($oferta->ativa(), 409, 'Esta oferta foi encerrada.');

        $oferta = $this->service->atualizar($oferta, $request->validated());

        return response()->json([
            'message' => 'Oferta atualizada!',
            'oferta' => $oferta->resumoDono(),
        ]);
    }

    public function destroy(Request $request, Oferta $oferta): JsonResponse
    {
        if (! $this->service->pertenceA($oferta, $request->user())) {
            return $this->semPermissao();
        }

        // RF13: encerra em vez de apagar; as contratações já feitas continuam valendo (RN11)
        $this->service->encerrar($oferta);

        return response()->json([
            'message' => 'Oferta encerrada.',
        ]);
    }

    private function semPermissao(): JsonResponse
    {
        return response()->json([
            'message' => 'Você só pode alterar as suas próprias ofertas.',
        ], 403);
    }
}
