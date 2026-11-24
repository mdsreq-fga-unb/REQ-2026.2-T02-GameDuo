<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

// Sessão contratada. Guarda uma cópia da oferta: mudar ou encerrar o anúncio não a altera.
class Contratacao extends Model
{
  public const AGENDADA = "agendada";
  public const EM_ANALISE = "em_analise";
  public const CONCLUIDA = "concluida";
  public const CANCELADA = "cancelada";
  public const DEVOLVIDA = "devolvida";

  public const OCORREU = "ocorreu";
  public const NAO_OCORREU = "nao_ocorreu";
  public const PROBLEMA = "problema";

  // enquanto estiver num destes, as moedas do consumidor continuam retidas
  public const RETIDAS = [self::AGENDADA, self::EM_ANALISE];

  protected $table = "Contratacao";

  protected $guarded = ["id"];

  protected $casts = [
    "duracao" => "integer",
    "preco" => "integer",
    "inicio" => "datetime",
    "fim" => "datetime",
    "concluida_em" => "datetime",
    "cancelada_em" => "datetime",
  ];

  public function consumidor(): BelongsTo
  {
    return $this->belongsTo(Usuario::class, "consumidor_email", "email");
  }

  public function prestador(): BelongsTo
  {
    return $this->belongsTo(Usuario::class, "prestador_email", "email");
  }

  public function scopeDe(Builder $query, string $email): Builder
  {
    return $query->where(fn (Builder $q) => $q
      ->where("consumidor_email", $email)
      ->orWhere("prestador_email", $email));
  }

  // RN20: horários que ocupam a agenda (canceladas liberam a vaga)
  public function scopeOcupando(Builder $query, string $prestador, Carbon $de, Carbon $ate): Builder
  {
    return $query->where("prestador_email", $prestador)
      ->where("status", "!=", self::CANCELADA)
      ->where("inicio", "<", $ate)
      ->where("fim", ">", $de);
  }

  // "consumidor", "prestador" ou null quando não participa
  public function papelDe(Usuario $usuario): ?string
  {
    return match ($usuario->email) {
      $this->consumidor_email => "consumidor",
      $this->prestador_email => "prestador",
      default => null,
    };
  }

  public function prazoResultado(): Carbon
  {
    return $this->fim->copy()->addHours(config("gameduo.prazo_resultado_horas"));
  }

  public function podeCancelar(): bool
  {
    return $this->status === self::AGENDADA && now()->lt($this->inicio);
  }

  public function podeRegistrar(string $papel): bool
  {
    return in_array($this->status, self::RETIDAS, true)
      && $this->{"resultado_{$papel}"} === null
      && now()->gte($this->inicio)
      && now()->lte($this->prazoResultado());
  }

  public function resumoPara(Usuario $usuario): array
  {
    $papel = $this->papelDe($usuario);
    $outro = $papel === "consumidor" ? "prestador" : "consumidor";

    return [
      "id" => $this->id,
      "papel" => $papel,
      "titulo" => $this->titulo,
      "descricao" => $this->descricao,
      "jogo" => $this->jogo,
      "modalidade" => $this->modalidade,
      "duracao" => $this->duracao,
      "preco" => $this->preco,
      "comunicacao" => $this->comunicacao,
      "condicoes" => $this->condicoes,
      "inicio" => $this->inicio,
      "fim" => $this->fim,
      "status" => $this->status,
      // RN21: cada parte recebe só o contato da outra
      "outra_parte" => [
        "nickname" => $this->{$outro}?->nickname,
        "contato" => $this->{"contato_{$outro}"},
      ],
      "meu_resultado" => $this->{"resultado_{$papel}"},
      "resultado_outra_parte" => $this->{"resultado_{$outro}"},
      "prazo_resultado" => $this->prazoResultado(),
      "concluida_em" => $this->concluida_em,
      "cancelada_em" => $this->cancelada_em,
      "cancelada_por" => $this->cancelada_por,
      "motivo_decisao" => $this->motivo_decisao,
      "pode_cancelar" => $this->podeCancelar(),
      "pode_registrar" => $this->podeRegistrar($papel),
      "email_sac" => config("gameduo.email_sac"),
    ];
  }
}
