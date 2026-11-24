<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // Provedor foi criada direto no Supabase; nos testes ela nasce depois das migrations
        if (! Schema::hasTable('Provedor') || Schema::hasColumn('Provedor', 'codigo')) {
            return;
        }

        Schema::table('Provedor', function (Blueprint $table) {
            // identificador público do perfil: o e-mail (chave primária) nunca vai para a URL
            $table->uuid('codigo')->nullable()->unique();
            $table->json('jogos')->nullable();
            $table->json('modalidades')->nullable();
            $table->json('formatos')->nullable();
            $table->json('idiomas')->nullable();
            $table->string('tipo_chave', 10)->nullable();
            // text porque o valor é gravado criptografado
            $table->text('cpf_titular')->nullable();
        });

        foreach (DB::table('Provedor')->whereNull('codigo')->pluck('email') as $email) {
            DB::table('Provedor')->where('email', $email)->update(['codigo' => (string) Str::uuid()]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('Provedor') || ! Schema::hasColumn('Provedor', 'codigo')) {
            return;
        }

        Schema::table('Provedor', function (Blueprint $table) {
            $table->dropUnique(['codigo']);
        });
        Schema::table('Provedor', function (Blueprint $table) {
            $table->dropColumn(['codigo', 'jogos', 'modalidades', 'formatos', 'idiomas', 'tipo_chave', 'cpf_titular']);
        });
    }
};
