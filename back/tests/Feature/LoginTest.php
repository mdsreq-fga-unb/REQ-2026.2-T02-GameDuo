<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
        $this->criarUsuario('jogador@gameduo.com');
    }

    public function test_login_com_credenciais_validas_retorna_token(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'jogador@gameduo.com',
            'senha' => 'senha123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'token_type', 'expires_in', 'usuario' => ['email', 'nome', 'nickname', 'prestador']])
            ->assertJsonPath('usuario.prestador', false)
            ->assertJsonMissingPath('usuario.senha');
    }

    public function test_login_ignora_maiusculas_no_email(): void
    {
        $this->postJson('/api/login', [
            'email' => '  Jogador@GameDuo.com ',
            'senha' => 'senha123',
        ])->assertOk();
    }

    public function test_login_com_senha_errada_retorna_401(): void
    {
        $this->postJson('/api/login', [
            'email' => 'jogador@gameduo.com',
            'senha' => 'errada',
        ])->assertUnauthorized();
    }

    public function test_me_retorna_usuario_logado(): void
    {
        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('usuario.email', 'jogador@gameduo.com');
    }

    public function test_rota_protegida_sem_token_retorna_401(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
        $this->get('/api/me')->assertUnauthorized();
    }

    public function test_logout_invalida_o_token(): void
    {
        $token = $this->tokenDe('jogador@gameduo.com');

        $this->withToken($token)->postJson('/api/logout')->assertOk();

        $this->app['auth']->forgetGuards();

        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }
}
