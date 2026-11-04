<?php

namespace Tests\Feature;

use App\Models\Oferta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

// RF44: o admin consulta usuários (lista com busca/filtro/paginação e detalhe).
class AdminUsuariosTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    private ?string $token = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
        $this->criarAdmin('ciro@gameduo.com');
        $this->criarUsuario('fulano@gmail.com', prestador: true);
        $this->criarUsuario('beltrano@gmail.com');
    }

    // o login do admin só acontece nos testes que precisam dele
    private function tokenDoAdmin(): string
    {
        return $this->token ??= $this->tokenDe('ciro@gameduo.com');
    }

    private function criarOfertaDo(string $email, string $jogo): void
    {
        $oferta = new Oferta([
            'titulo' => 'Coaching de mira',
            'jogo' => $jogo,
            'modalidade' => 'Coaching',
            'duracao' => 60,
            'preco' => 100,
        ]);
        $oferta->email = $email;
        $oferta->save();
    }

    private function listar(string $query = '')
    {
        return $this->withToken($this->tokenDoAdmin())->getJson('/api/admin/usuarios' . $query);
    }

    public function test_lista_todos_com_email_mascarado(): void
    {
        $this->listar()
            ->assertOk()
            ->assertJsonPath('total', 3)
            ->assertJsonPath('pagina', 1)
            ->assertJsonPath('itens.0.nickname', 'beltrano')
            ->assertJsonPath('itens.0.email_mascarado', 'be***@gmail.com')
            ->assertJsonPath('itens.0.presta_servico', false)
            ->assertJsonPath('itens.2.nickname', 'fulano')
            ->assertJsonPath('itens.2.presta_servico', true);
    }

    public function test_lista_nao_expoe_senha_nem_pix(): void
    {
        $response = $this->listar()->assertOk();

        $this->assertStringNotContainsString('senha', $response->getContent());
        $this->assertStringNotContainsString('pix@teste.com', $response->getContent());
    }

    public function test_busca_por_parte_do_nickname_sem_diferenciar_maiusculas(): void
    {
        $this->listar('?busca=FULA')
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('itens.0.nickname', 'fulano');
    }

    public function test_busca_por_email(): void
    {
        $this->listar('?busca=gameduo.com')
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('itens.0.nickname', 'ciro');
    }

    public function test_busca_sem_resultado_devolve_lista_vazia(): void
    {
        $this->listar('?busca=ninguem')
            ->assertOk()
            ->assertJsonPath('total', 0)
            ->assertJsonCount(0, 'itens');
    }

    public function test_filtra_somente_prestadores(): void
    {
        $this->listar('?tipo=prestadores')
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('itens.0.nickname', 'fulano');
    }

    public function test_filtra_somente_consumidores(): void
    {
        $this->listar('?tipo=consumidores')
            ->assertOk()
            ->assertJsonPath('total', 2);
    }

    public function test_paginacao(): void
    {
        $this->listar('?por_pagina=2&pagina=2')
            ->assertOk()
            ->assertJsonPath('total', 3)
            ->assertJsonPath('pagina', 2)
            ->assertJsonPath('ultima_pagina', 2)
            ->assertJsonCount(1, 'itens');
    }

    public function test_recusa_filtros_invalidos(): void
    {
        $this->listar('?por_pagina=500&tipo=hackers')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['por_pagina', 'tipo']);
    }

    public function test_detalhe_do_prestador(): void
    {
        $this->criarOfertaDo('fulano@gmail.com', 'League of Legends');
        $this->criarOfertaDo('fulano@gmail.com', 'Counter-Strike 2');
        $this->criarOfertaDo('fulano@gmail.com', 'Counter-Strike 2');

        $response = $this->withToken($this->tokenDoAdmin())
            ->getJson('/api/admin/usuarios/fulano@gmail.com')
            ->assertOk()
            ->assertJson([
                'email' => 'fulano@gmail.com',
                'nickname' => 'fulano',
                'role' => 'user',
                'presta_servico' => true,
                'jogos' => ['Counter-Strike 2', 'League of Legends'],
                'ofertas_ativas' => 3,
                'dados_recebimento_cadastrados' => true,
            ]);

        // a chave Pix (Provedor.dados) e a senha nunca saem na resposta
        $this->assertStringNotContainsString('pix@teste.com', $response->getContent());
        $response->assertJsonMissingPath('senha')->assertJsonMissingPath('dados');
    }

    public function test_detalhe_de_quem_nao_presta_servico(): void
    {
        $this->withToken($this->tokenDoAdmin())
            ->getJson('/api/admin/usuarios/beltrano@gmail.com')
            ->assertOk()
            ->assertJson([
                'presta_servico' => false,
                'jogos' => [],
                'ofertas_ativas' => 0,
                'dados_recebimento_cadastrados' => false,
            ]);
    }

    public function test_detalhe_de_usuario_inexistente_retorna_404(): void
    {
        $this->withToken($this->tokenDoAdmin())
            ->getJson('/api/admin/usuarios/naoexiste@gmail.com')
            ->assertNotFound();
    }

    public function test_usuario_comum_nao_consulta(): void
    {
        $token = $this->tokenDe('beltrano@gmail.com');

        $this->withToken($token)->getJson('/api/admin/usuarios')->assertForbidden();
        $this->withToken($token)->getJson('/api/admin/usuarios/fulano@gmail.com')->assertForbidden();
    }

    public function test_visitante_nao_consulta(): void
    {
        $this->getJson('/api/admin/usuarios')->assertUnauthorized();
        $this->getJson('/api/admin/usuarios/fulano@gmail.com')->assertUnauthorized();
    }
}
