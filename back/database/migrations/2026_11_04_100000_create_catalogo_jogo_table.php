<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // RF50: jogos que o admin mantém e que aparecem no catálogo e nas ofertas.
        // (A tabela Jogo, do Supabase, é outra coisa: os jogos de cada prestador.)
        Schema::create('CatalogoJogo', function (Blueprint $table) {
            $table->id();
            // 60 = mesmo tamanho de Oferta.jogo, que guarda o nome do jogo
            $table->string('nome', 60)->unique();
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });

        // os dois jogos que já estavam fixos no código
        DB::table('CatalogoJogo')->insert([
            ['nome' => 'Counter-Strike 2', 'ativo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'League of Legends', 'ativo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('CatalogoJogo');
    }
};
