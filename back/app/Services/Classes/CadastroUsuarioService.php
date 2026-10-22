<?php

namespace App\Services\Classes;

use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class CadastroUsuarioService
{
    public function cadastrar(array $dados): Usuario
    {
        return Usuario::create([
            'email' => $dados['email'],
            'nome' => $dados['nome'],
            'nickname' => $dados['nickname'],
            'senha' => Hash::make($dados['senha']),
        ]);
    }
}