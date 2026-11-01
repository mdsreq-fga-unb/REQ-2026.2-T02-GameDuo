<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Classes\CarteiraService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CarteiraController extends Controller
{
    public function __construct(private CarteiraService $service)
    {
    }

    public function saldo(Request $request): JsonResponse
    {
        return response()->json([
            'saldo' => $this->service->saldo($request->user()),
        ]);
    }

    public function extrato(Request $request): JsonResponse
    {
        return response()->json([
            'movimentos' => $this->service->extrato($request->user())->map->resumo(),
        ]);
    }
}
