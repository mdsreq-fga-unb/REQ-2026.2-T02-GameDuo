<?php

namespace App\Services\Classes;

use App\Mail\CodigoRecuperacaoMail;
use App\Models\CodigoRecuperacao;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Throwable;

// RF03 / RN04: código de uso único, válido por 30 minutos, só por e-mail.
class RecuperacaoSenhaService
{
    // Nunca revela se a conta existe: a resposta é a mesma nos dois casos.
    public function solicitar(string $email): void
    {
        // por conta, além do limite por IP da rota: sem isso daria para pedir
        // códigos novos sem parar e zerar a contagem de tentativas
        if (! RateLimiter::attempt("recuperar:{$email}", 5, fn () => true, 1800)) {
            return;
        }

        if (! Usuario::whereKey($email)->exists()) {
            return;
        }

        $codigo = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        CodigoRecuperacao::updateOrCreate(['email' => $email], [
            'codigo_hash' => Hash::make($codigo),
            'tentativas' => 0,
            'expira_em' => now()->addMinutes(config('gameduo.recuperacao_minutos')),
        ]);

        try {
            Mail::to($email)->send(new CodigoRecuperacaoMail($codigo));
        } catch (Throwable $exception) {
            // servidor de e-mail fora do ar não pode revelar que a conta existe
            report($exception);
        }
    }

    // confere sem gastar o código (tela de validação)
    public function conferir(string $email, string $codigo): bool
    {
        return DB::transaction(fn () => $this->codigoValido($email, $codigo) !== null);
    }

    public function redefinir(string $email, string $codigo, string $senha): bool
    {
        return DB::transaction(function () use ($email, $codigo, $senha) {
            $registro = $this->codigoValido($email, $codigo);
            $usuario = $registro ? Usuario::find($email) : null;

            if (! $usuario) {
                return false;
            }

            $usuario->senha = Hash::make($senha);
            $usuario->save();
            // uso único
            $registro->delete();

            return true;
        });
    }

    private function codigoValido(string $email, string $codigo): ?CodigoRecuperacao
    {
        $registro = CodigoRecuperacao::where('email', $email)->lockForUpdate()->first();

        if (! $registro
            || $registro->expira_em->isPast()
            || $registro->tentativas >= config('gameduo.recuperacao_tentativas')) {
            return null;
        }

        if (! Hash::check($codigo, $registro->codigo_hash)) {
            $registro->increment('tentativas');

            return null;
        }

        return $registro;
    }
}
