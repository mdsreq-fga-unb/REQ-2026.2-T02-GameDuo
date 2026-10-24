<?php

namespace App\Services\Classes;

use App\Models\Provedor;
use App\Models\Usuario;

class PrestadorService
{
    public function ativar(Usuario $usuario, array $dados): Provedor
    {
        return Provedor::create([
            'email' => $usuario->email,
            'apresentacao' => $dados['apresentacao'] ?? null,
            'dados' => $dados['dados'],
        ]);
    }
}
