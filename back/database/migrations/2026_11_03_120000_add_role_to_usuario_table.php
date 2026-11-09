<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Usuario foi criada direto no Supabase; nos testes (SQLite) ela só
        // nasce depois das migrations, então aqui não há o que alterar.
        if (! Schema::hasTable('Usuario') || Schema::hasColumn('Usuario', 'role')) {
            return;
        }

        Schema::table('Usuario', function (Blueprint $table) {
            // 'user' para todo cadastro feito pelo site; 'admin' só via seeder
            $table->string('role', 10)->default('user');
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('Usuario', 'role')) {
            Schema::table('Usuario', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }
};
