<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // se o mesmo aviso chegar duas vezes, o segundo insert falha no unique e nada é processado em dobro
        Schema::create('WebhookRecebido', function (Blueprint $table) {
            $table->id();
            $table->string('evento_id')->unique();
            $table->string('tipo', 60);
            $table->json('payload');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('WebhookRecebido');
    }
};
