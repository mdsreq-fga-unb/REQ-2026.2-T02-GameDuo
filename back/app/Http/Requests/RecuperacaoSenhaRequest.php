<?php

namespace App\Http\Requests;

// Serve as três etapas: cada rota exige um campo a mais.
class RecuperacaoSenhaRequest extends LoginRequest
{
    public function rules(): array
    {
        $regras = ['email' => ['required', 'string', 'email', 'max:100']];

        if (! $this->routeIs('senha.solicitar')) {
            $regras['codigo'] = ['required', 'string', 'digits:6'];
        }
        if ($this->routeIs('senha.redefinir')) {
            $regras['senha'] = CadastroUsuarioRequest::regrasDaSenha();
        }

        return $regras;
    }

    public function messages(): array
    {
        return [
            ...(new CadastroUsuarioRequest)->messages(),
            'codigo.required' => 'Informe o código recebido.',
            'codigo.digits' => 'O código tem 6 números.',
        ];
    }
}
