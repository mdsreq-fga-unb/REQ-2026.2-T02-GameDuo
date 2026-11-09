<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Database\Seeders\AdminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class AdminSeederTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
    }

    protected function tearDown(): void
    {
        unset($_SERVER['ADMIN_EMAIL'], $_SERVER['ADMIN_PASSWORD']);

        parent::tearDown();
    }

    public function test_cadastro_comum_recebe_papel_user(): void
    {
        $this->criarUsuario('jogador@gameduo.com');

        $this->assertSame('user', Usuario::find('jogador@gameduo.com')->role);
    }

    public function test_seeder_cria_admin_sem_duplicar(): void
    {
        $_SERVER['ADMIN_EMAIL'] = 'Ciro@GameDuo.com';
        $_SERVER['ADMIN_PASSWORD'] = 'senha-de-teste';

        // roda duas vezes de propósito: não pode criar duas contas
        $this->seed(AdminSeeder::class);
        $this->seed(AdminSeeder::class);

        $this->assertSame(1, Usuario::count());

        $admin = Usuario::find('ciro@gameduo.com');
        $this->assertSame('admin', $admin->role);
        $this->assertTrue(Hash::check('senha-de-teste', $admin->senha));
    }
}
