<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

// Jogo do catálogo da plataforma (RF50). Não se exclui: desativa-se (ativo = false),
// porque ofertas antigas guardam o nome do jogo.
class CatalogoJogo extends Model
{
  protected $table = "CatalogoJogo";

  protected $fillable = [
    "nome",
    "ativo",
  ];

  protected $casts = [
    "ativo" => "boolean",
  ];

  public function scopeAtivos(Builder $query): Builder
  {
    return $query->where("ativo", true);
  }

  // procura pelo nome sem diferenciar maiúsculas ("cs2" e "CS2" são o mesmo jogo)
  public function scopeComNome(Builder $query, string $nome): Builder
  {
    return $query->whereRaw("LOWER(nome) = ?", [mb_strtolower($nome)]);
  }

  public function resumo(): array
  {
    return [
      "id" => $this->id,
      "nome" => $this->nome,
      "ativo" => $this->ativo,
    ];
  }
}
