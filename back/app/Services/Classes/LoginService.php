<?php

namespace App\Services\Classes;

use App\Models\Usuario;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;

class LoginService
{
    public function verificar(string $email, string $senha): Usuario
    {
        $usuario = Usuario::where('email', $email)->first();

        if (! $usuario || ! Hash::check($senha, $usuario->senha)) {
            throw new AuthenticationException(
                'E-mail ou senha inválidos.'
            );
        }

        return $usuario;
    }
}