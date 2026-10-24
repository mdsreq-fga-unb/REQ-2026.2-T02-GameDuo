<?php

namespace Tests;

use App\Models\Provedor;
use App\Models\Usuario;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

// Usuario e Provedor foram criadas direto no Supabase (sem migration),
// então os testes recriam essas tabelas no SQLite em memória.
trait CriaTabelasDoSupabase
{
    protected function criarTabelasDoSupabase(): void
    {
        Schema::create('Usuario', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('nome');
            $table->string('nickname')->nullable();
            $table->string('senha');
        });

        Schema::create('Provedor', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->text('apresentacao')->nullable();
            $table->text('dados');
        });
    }

    protected function criarUsuario(string $email, bool $prestador = false): Usuario
    {
        $usuario = Usuario::create([
            'email' => $email,
            'nome' => 'Jogador',
            'nickname' => strstr($email, '@', true),
            'senha' => Hash::make('senha123'),
        ]);

        if ($prestador) {
            Provedor::create(['email' => $email, 'dados' => 'pix@teste.com']);
        }

        return $usuario;
    }

    protected function tokenDe(string $email): string
    {
        return $this->postJson('/api/login', [
            'email' => $email,
            'senha' => 'senha123',
        ])->json('token');
    }
}
