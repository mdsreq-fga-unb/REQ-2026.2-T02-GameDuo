<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AgendaRequest;
use App\Models\Oferta;
use App\Services\Classes\AgendaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    public function __construct(private AgendaService $service)
    {
    }

    // RF15: público, como o catálogo (RN02)
    public function vagas(Oferta $oferta): JsonResponse
    {
        abort_unless($oferta->ativa(), 404, 'Oferta não encontrada.');

        return response()->json([
            'vagas' => $this->service->vagas($oferta)->values(),
        ]);
    }

    public function show(Request $request, Oferta $oferta): JsonResponse
    {
        $this->conferirDono($request, $oferta);

        return response()->json([
            'oferta' => $oferta->resumoDono(),
            'intervalos' => $oferta->agenda->map->resumo(),
        ]);
    }

    public function update(AgendaRequest $request, Oferta $oferta): JsonResponse
    {
        $this->conferirDono($request, $oferta);

        $agenda = $this->service->salvar($oferta, $request->validated('intervalos'));

        return response()->json([
            'message' => 'Agenda salva!',
            'intervalos' => $agenda->map->resumo(),
        ]);
    }

    private function conferirDono(Request $request, Oferta $oferta): void
    {
        abort_unless($oferta->email === $request->user()->email, 403, 'Você só pode alterar as suas próprias ofertas.');
        abort_unless($oferta->ativa(), 404, 'Oferta não encontrada.');
    }
}
