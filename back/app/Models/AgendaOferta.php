<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// RF14: um intervalo semanal de atendimento (dia 0 = domingo), no horário de Brasília.
class AgendaOferta extends Model
{
  protected $table = "AgendaOferta";

  public $timestamps = false;

  protected $fillable = ["dia", "inicio", "fim"];

  protected $casts = ["dia" => "integer"];

  public function resumo(): array
  {
    return ["dia" => $this->dia, "inicio" => $this->inicio, "fim" => $this->fim];
  }
}
