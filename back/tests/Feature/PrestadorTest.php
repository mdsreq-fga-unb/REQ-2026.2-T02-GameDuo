<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class PrestadorTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
    }

    public function test_usuario_ativa_perfil_de_prestador(): void
    {
        $this->criarUsuario('jogador@gameduo.com');

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/prestador', ['apresentacao' => 'Coach de CS2', 'dados' => 'pix@gameduo.com'])
            ->assertCreated()
            ->assertJsonPath('usuario.prestador', true);

        $this->assertDatabaseHas('Provedor', ['email' => 'jogador@gameduo.com', 'dados' => 'pix@gameduo.com']);
    }

    public function test_ativar_exige_chave_pix(): void
    {
        $this->criarUsuario('jogador@gameduo.com');

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/prestador', ['apresentacao' => 'Coach'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('dados');
    }

    public function test_nao_ativa_duas_vezes(): void
    {
        $this->criarUsuario('coach@gameduo.com', prestador: true);

        $this->withToken($this->tokenDe('coach@gameduo.com'))
            ->postJson('/api/prestador', ['dados' => 'outra@pix.com'])
            ->assertStatus(409);
    }

    public function test_ativar_exige_login(): void
    {
        $this->postJson('/api/prestador', ['dados' => 'pix@gameduo.com'])->assertUnauthorized();
    }
}
