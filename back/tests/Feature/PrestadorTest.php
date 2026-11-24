<?php

namespace Tests\Feature;

use App\Models\Provedor;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class PrestadorTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    private array $perfil = [
        'apresentacao' => 'Coach de CS2',
        'jogos' => [['jogo' => 'Counter-Strike 2', 'nivel' => 'Faceit 10']],
        'modalidades' => ['Coaching'],
        'formatos' => ['Individual'],
        'idiomas' => ['Português'],
    ];

    private array $recebimento = [
        'tipo_chave' => 'EMAIL',
        'dados' => 'pix@gameduo.com',
        'cpf_titular' => '529.982.247-25',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
    }

    public function test_usuario_ativa_perfil_de_prestador(): void
    {
        $this->criarUsuario('jogador@gameduo.com');

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/prestador', [...$this->perfil, ...$this->recebimento])
            ->assertCreated()
            ->assertJsonPath('usuario.prestador', true);

        $this->assertDatabaseHas('Provedor', ['email' => 'jogador@gameduo.com', 'dados' => 'pix@gameduo.com']);
    }

    public function test_ativar_exige_perfil_e_recebimento(): void
    {
        $this->criarUsuario('jogador@gameduo.com');

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/prestador', ['apresentacao' => 'Coach'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['dados', 'tipo_chave', 'cpf_titular', 'jogos', 'modalidades', 'formatos', 'idiomas']);
    }

    public function test_nao_ativa_duas_vezes(): void
    {
        $this->criarUsuario('coach@gameduo.com', prestador: true);

        $this->withToken($this->tokenDe('coach@gameduo.com'))
            ->postJson('/api/prestador', [...$this->perfil, ...$this->recebimento])
            ->assertStatus(409);
    }

    public function test_ativar_exige_login(): void
    {
        $this->postJson('/api/prestador', ['dados' => 'pix@gameduo.com'])->assertUnauthorized();
    }

    public function test_prestador_edita_o_perfil_e_qualquer_um_consulta(): void
    {
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $this->actingAs(Usuario::find('coach@gameduo.com'), 'api');
        $this->putJson('/api/prestador/perfil', $this->perfil)->assertOk();

        $codigo = Provedor::first()->codigo;
        $this->app['auth']->forgetGuards();
        $this->getJson("/api/prestadores/{$codigo}")
            ->assertOk()
            ->assertJsonPath('prestador.nickname', 'coach')
            ->assertJsonPath('prestador.jogos.0.nivel', 'Faceit 10')
            ->assertJsonMissingPath('prestador.dados');
        $this->getJson('/api/prestadores/00000000-0000-4000-8000-000000000000')->assertNotFound();
    }

    public function test_perfil_recusa_opcoes_fora_da_lista(): void
    {
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $this->actingAs(Usuario::find('coach@gameduo.com'), 'api');
        $this->putJson('/api/prestador/perfil', [...$this->perfil, 'idiomas' => ['Klingon'], 'jogos' => [['jogo' => 'Inexistente', 'nivel' => 'x']]])
            ->assertJsonValidationErrors(['idiomas.0', 'jogos.0.jogo']);
    }
}
