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
        return response()->json([
            'oferta' => $oferta->load('usuario')->resumo(),
        ]);
    }

    public function minhas(Request $request): JsonResponse
    {
        return response()->json([
            'ofertas' => $this->service->listarDoPrestador($request->user())->map->resumo(),
        ]);
    }

    public function store(OfertaRequest $request): JsonResponse
    {
        $oferta = $this->service->criar($request->user(), $request->validated());

        return response()->json([
            'message' => 'Oferta publicada!',
            'oferta' => $oferta->resumo(),
        ], 201);
    }

    public function update(OfertaRequest $request, Oferta $oferta): JsonResponse
    {
        if (! $this->service->pertenceA($oferta, $request->user())) {
            return $this->semPermissao();
        }

        $oferta = $this->service->atualizar($oferta, $request->validated());

        return response()->json([
            'message' => 'Oferta atualizada!',
            'oferta' => $oferta->resumo(),
        ]);
    }

    public function destroy(Request $request, Oferta $oferta): JsonResponse
    {
        if (! $this->service->pertenceA($oferta, $request->user())) {
            return $this->semPermissao();
        }

        $this->service->excluir($oferta);

        return response()->json([
            'message' => 'Oferta excluída.',
        ]);
    }

    private function semPermissao(): JsonResponse
    {
        return response()->json([
            'message' => 'Você só pode alterar as suas próprias ofertas.',
        ], 403);
    }
}
