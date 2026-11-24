<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Oferta extends Model
{
  public const ATIVA = "ativa";
  public const ENCERRADA = "encerrada";

  protected $table = "Oferta";

  protected $attributes = [
    "status" => self::ATIVA,
  ];

  protected $fillable = [
    "titulo",
    "descricao",
    "jogo",
    "modalidade",
    "nivel",
    "duracao",
    "preco",
    "comunicacao",
    "contato",
    "condicoes",
  ];

  protected $casts = [
    "duracao" => "integer",
    "preco" => "integer",
    "encerrada_em" => "datetime",
  ];

  // Oferta.email aponta para Provedor, que tem o mesmo e-mail do Usuario
  public function usuario(): BelongsTo
  {
    return $this->belongsTo(Usuario::class, "email", "email");
  }

  public function agenda(): HasMany
  {
    return $this->hasMany(AgendaOferta::class, "oferta_id")->orderBy("dia")->orderBy("inicio");
  }

  public function scopeAtivas(Builder $query): Builder
  {
    return $query->where("status", self::ATIVA);
  }

  public function ativa(): bool
  {
    return $this->status === self::ATIVA;
  }

  // dados que só o dono vê
  public function resumoDono(): array
  {
    return [...$this->resumo(), "contato" => $this->contato];
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
      "comunicacao" => $this->comunicacao,
      "condicoes" => $this->condicoes,
      "prestador" => [
        "codigo" => $this->usuario?->provedor?->codigo,
        "nome" => $this->usuario?->nome,
        "nickname" => $this->usuario?->nickname,
      ],
    ];
  }
}
