<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AgendaRequest extends FormRequest
{
    private const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // lista vazia é válida: deixa a oferta sem horários
            'intervalos' => ['present', 'array', 'max:70'],
            'intervalos.*.dia' => ['required', 'integer', 'between:0,6'],
            'intervalos.*.inicio' => ['required', 'date_format:H:i'],
            'intervalos.*.fim' => ['required', 'date_format:H:i', 'after:intervalos.*.inicio'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $duracao = $this->route('oferta')->duracao;
            $minutos = fn (string $hora) => (int) substr($hora, 0, 2) * 60 + (int) substr($hora, 3);

            foreach (collect($this->input('intervalos'))->groupBy('dia') as $dia => $doDia) {
                $anterior = null;
                foreach ($doDia->sortBy('inicio') as $atual) {
                    if ($anterior && $atual['inicio'] < $anterior['fim']) {
                        $validator->errors()->add('intervalos', 'Há horários sobrepostos no dia: '.self::DIAS[$dia].'.');
                    }
                    if ($minutos($atual['fim']) - $minutos($atual['inicio']) < $duracao) {
                        $validator->errors()->add('intervalos', "Cada intervalo precisa ter pelo menos {$duracao} minutos, a duração da oferta.");
                    }
                    $anterior = $atual;
                }
            }
        }];
    }

    public function messages(): array
    {
        return [
            'intervalos.*.inicio.*' => 'Informe o início no formato HH:MM.',
            'intervalos.*.fim.after' => 'O fim do intervalo deve ser depois do início.',
            'intervalos.*.fim.*' => 'Informe o fim no formato HH:MM.',
        ];
    }
}
