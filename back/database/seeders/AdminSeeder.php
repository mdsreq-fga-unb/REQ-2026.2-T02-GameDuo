<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

// Cria (ou promove) a conta de administrador com os dados do .env.
// Pode rodar quantas vezes quiser: nunca cria duas contas.
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = mb_strtolower(trim((string) env('ADMIN_EMAIL')));
        $senha = (string) env('ADMIN_PASSWORD');

        if ($email === '' || $senha === '') {
            $this->command->error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar este seeder.');

            return;
        }

        // busca pelo e-mail (chave primária); se não existir, prepara uma conta nova
        $admin = Usuario::firstOrNew(['email' => $email]);
        $admin->nome = $admin->nome ?: env('ADMIN_NOME', 'Administrador');
        $admin->nickname = $admin->nickname ?: env('ADMIN_NICKNAME', 'Admin');
        $admin->senha = Hash::make($senha);
        $admin->role = 'admin';
        $admin->save();

        $this->command->info("Conta de administrador pronta: {$email}");
    }
}
