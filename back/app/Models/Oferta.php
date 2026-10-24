<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Oferta extends Model
{
  protected $table = "Oferta";

  protected $fillable = [
    "titulo",
    "descricao",
    "jogo",
    "modalidade",
    "nivel",
    "duracao",
    "preco",
  ];

  protected $casts = [
    "duracao" => "integer",
    "preco" => "integer",
  ];

  // Oferta.email aponta para Provedor, que tem o mesmo e-mail do Usuario
  public function usuario(): BelongsTo
  {
    return $this->belongsTo(Usuario::class, "email", "email");
  }

  public function resumo(): array
  {
    return [
      "id" => $this->id,
      "titulo" => $this->titulo,
      "descricao" => $this->descricao,
      "jogo" => $this->jogo,
      "modalidade" => $this->modalidade,
      "nivel" => $this->nivel,
      "duracao" => $this->duracao,
      "preco" => $this->preco,
      "prestador" => [
        "nome" => $this->usuario?->nome,
        "nickname" => $this->usuario?->nickname,
      ],
    ];
  }
}
