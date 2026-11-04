<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class AdminAcessoTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
    }

    public function test_login_devolve_role_admin(): void
    {
        $this->criarAdmin('ciro@gameduo.com');

        $this->postJson('/api/login', ['email' => 'ciro@gameduo.com', 'senha' => 'senha123'])
            ->assertOk()
            ->assertJsonPath('usuario.role', 'admin');
    }

    public function test_login_devolve_role_user_para_conta_comum(): void
    {
        $this->criarUsuario('jogador@gameduo.com');

        $this->postJson('/api/login', ['email' => 'jogador@gameduo.com', 'senha' => 'senha123'])
            ->assertOk()
            ->assertJsonPath('usuario.role', 'user');
    }

    public function test_visitante_sem_token_recebe_401(): void
    {
        $this->getJson('/api/admin/resumo')->assertUnauthorized();
    }

    public function test_usuario_comum_recebe_403(): void
    {
        $this->criarUsuario('jogador@gameduo.com');

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->getJson('/api/admin/resumo')
            ->assertForbidden();
    }

    public function test_admin_ve_o_resumo(): void
    {
        $this->criarAdmin('ciro@gameduo.com');
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $this->criarUsuario('jogador@gameduo.com');

        $this->withToken($this->tokenDe('ciro@gameduo.com'))
            ->getJson('/api/admin/resumo')
            ->assertOk()
            ->assertExactJson(['total_usuarios' => 3, 'total_prestadores' => 1]);
    }

    public function test_cadastro_pelo_site_nao_cria_admin(): void
    {
        $this->postJson('/api/usuarios', [
            'email' => 'espertinho@gameduo.com',
            'nome' => 'Espertinho',
            'nickname' => 'espertinho',
            'senha' => 'senha12345',
            'senha_confirmation' => 'senha12345',
            'role' => 'admin',
        ])->assertCreated();

        $this->assertSame('user', Usuario::find('espertinho@gameduo.com')->role);
    }
}
