<?php

namespace App\Http\Requests;

use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// RF05 / RN06: chave no formato que a transferência Pix do Asaas aceita
class RecebimentoRequest extends FormRequest
{
    public const TIPOS = ['CPF', 'EMAIL', 'PHONE', 'EVP'];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(self::normalizar($this->only(['dados', 'tipo_chave', 'cpf_titular'])));
    }

    public static function normalizar(array $dados): array
    {
        foreach ($dados as $campo => $valor) {
            $dados[$campo] = is_string($valor) ? trim($valor) : $valor;
        }

        if (is_string($dados['dados'] ?? null)) {
            $dados['dados'] = match ($dados['tipo_chave'] ?? null) {
                'CPF' => preg_replace('/\D/', '', $dados['dados']),
                // o Asaas recebe DDD + número, sem o +55
                'PHONE' => preg_replace('/^55(?=\d{11}$)/', '', preg_replace('/\D/', '', $dados['dados'])),
                'EMAIL', 'EVP' => mb_strtolower($dados['dados']),
                default => $dados['dados'],
            };
        }
        if (is_string($dados['cpf_titular'] ?? null)) {
            $dados['cpf_titular'] = preg_replace('/\D/', '', $dados['cpf_titular']);
        }

        return $dados;
    }

    public function rules(): array
    {
        return self::regras($this->input('tipo_chave'));
    }

    public static function regras(mixed $tipo): array
    {
        $formato = match ($tipo) {
            'CPF' => [self::cpf()],
            'EMAIL' => ['email'],
            'PHONE' => ['regex:/^\d{11}$/'],
            'EVP' => ['uuid'],
            default => [],
        };

        return [
            'tipo_chave' => ['required', 'string', Rule::in(self::TIPOS)],
            'dados' => ['required', 'string', 'max:150', ...$formato],
            'cpf_titular' => ['required', 'string', self::cpf()],
        ];
    }

    public function messages(): array
    {
        return self::mensagens();
    }

    public static function mensagens(): array
    {
        return [
            'dados.required' => 'Informe sua chave Pix para recebimento.',
            'dados.max' => 'A chave Pix deve ter no máximo 150 caracteres.',
            'dados.email' => 'A chave deve ser um e-mail válido.',
            'dados.regex' => 'A chave deve ser um celular com DDD.',
            'dados.uuid' => 'Cole a chave aleatória completa.',
            'tipo_chave.required' => 'Escolha o tipo da chave Pix.',
            'tipo_chave.in' => 'Escolha um tipo de chave da lista.',
            'cpf_titular.required' => 'Informe o CPF do titular.',
        ];
    }

    private static function cpf(): Closure
    {
        return function (string $campo, mixed $valor, Closure $falha) {
            $valido = is_string($valor) && preg_match('/^\d{11}$/', $valor) && ! preg_match('/^(\d)\1{10}$/', $valor);

            for ($t = 9; $valido && $t < 11; $t++) {
                $soma = 0;
                for ($i = 0; $i < $t; $i++) {
                    $soma += (int) $valor[$i] * ($t + 1 - $i);
                }
                $valido = (int) $valor[$t] === ($soma * 10) % 11 % 10;
            }

            if (! $valido) {
                $falha('Informe um CPF válido.');
            }
        };
    }
}
