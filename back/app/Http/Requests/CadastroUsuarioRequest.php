<?php

namespace App\Http\Requests;

use App\Models\Usuario;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CadastroUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        //Postgres compara texto com diferença de maiúsculas: evita duas contas para o mesmo email
        $this->merge([
            'email' => strtolower(trim((string) $this->input('email'))),
        ]);   
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:100', 'unique:Usuario,email'],
            'nome' => ['required', 'string', 'max:100'],
            'nickname' => ['required', 'string', 'max:50', self::nicknameLivre()],
            'senha' => self::regrasDaSenha(),
        ];
    }
    
    public static function regrasDaSenha(): array
    {
        return ['required', 'string', 'max:100', 'confirmed', Password::min(8), 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[^A-Za-z0-9]/'];
    }

    // o nickname é a identificação pública: "Ana" e "ana" são o mesmo
    public static function nicknameLivre(?string $exceto = null): Closure
    {
        return function (string $campo, mixed $valor, Closure $falha) use ($exceto) {
            $emUso = Usuario::whereRaw('LOWER(nickname) = ?', [mb_strtolower((string) $valor)])
                ->when($exceto, fn ($query) => $query->where('email', '!=', $exceto))
                ->exists();

            if ($emUso) {
                $falha('Este nickname já está em uso.');
            }
        };
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Informe o e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'nome.required' => 'Informe o nome.',
            'nickname.required' => 'Informe o nickname.',
            'senha.required' => 'Informe a senha.',
            'senha.confirmed' => 'A confirmação de senha não confere.',
            'senha.min' => 'A senha deve ter pelo menos 8 caracteres.',
            'senha.regex' => 'A senha precisa ter uma letra maiúscula, um número e um símbolo.',
        ];
    }
}