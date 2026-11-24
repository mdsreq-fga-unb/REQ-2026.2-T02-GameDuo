<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

// RF01: correção dos dados da conta. O e-mail é a chave da conta e não muda.
class AtualizarContaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $regras = [
            'nome' => ['required', 'string', 'max:100'],
            'nickname' => ['required', 'string', 'max:50', CadastroUsuarioRequest::nicknameLivre($this->user()->email)],
        ];

        // trocar a senha é opcional
        if ($this->filled('senha')) {
            $regras['senha'] = CadastroUsuarioRequest::regrasDaSenha();
            $regras['senha_atual'] = ['required', 'string', function ($campo, $valor, $falha) {
                if (! Hash::check((string) $valor, $this->user()->senha)) {
                    $falha('A senha atual não confere.');
                }
            }];
        }

        return $regras;
    }

    public function messages(): array
    {
        return [
            ...(new CadastroUsuarioRequest)->messages(),
            'senha_atual.required' => 'Informe a senha atual para trocar a senha.',
        ];
    }
}
