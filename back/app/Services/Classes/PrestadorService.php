<?php

namespace App\Services\Classes;

use App\Models\Provedor;
use App\Models\Usuario;

class PrestadorService
{
    public function ativar(Usuario $usuario, array $dados): Provedor
    {
        $provedor = Provedor::create([
            'email' => $usuario->email,
            'apresentacao' => $dados['apresentacao'] ?? null,
            'dados' => $dados['dados'],
        ]);

        // o controller já carregou a relação (vazia) ao checar ehPrestador(); atualiza para o resumo() sair certo
        $usuario->setRelation('provedor', $provedor);

        return $provedor;
    }
}
