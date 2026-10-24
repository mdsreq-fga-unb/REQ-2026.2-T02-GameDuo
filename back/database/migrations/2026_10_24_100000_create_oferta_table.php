<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // segue o padrão das tabelas do Supabase (Usuario, Provedor, Jogo): nome no singular
        Schema::create('Oferta', function (Blueprint $table) {
            $table->id();
            $table->text('email');
            $table->string('titulo', 120);
            $table->text('descricao')->nullable();
            $table->string('jogo', 60);
            $table->string('modalidade', 20);
            $table->string('nivel', 50)->nullable();
            $table->unsignedSmallInteger('duracao');
            $table->unsignedInteger('preco');
            $table->timestamps();

            // só quem tem perfil de prestador (linha em Provedor) pode ter ofertas
            $table->foreign('email')->references('email')->on('Provedor')->cascadeOnDelete();
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Oferta');
    }
};
