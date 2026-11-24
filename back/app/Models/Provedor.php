<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

// Perfil de prestador: o usuário é prestador quando tem uma linha nesta tabela.
class Provedor extends Model
{
  protected $table = "Provedor";
  protected $primaryKey = "email";

  public $incrementing = false;

  protected $keyType = "string";

  public $timestamps = false;

  // dados de recebimento (ex.: chave Pix) não saem na API
  protected $hidden = [
    "dados",
    "tipo_chave",
    "cpf_titular",
  ];

  protected $casts = [
    "jogos" => "array",
    "modalidades" => "array",
    "formatos" => "array",
    "idiomas" => "array",
    "cpf_titular" => "encrypted",
  ];

  protected $fillable = [
    "email",
    "apresentacao",
    "dados",
    "tipo_chave",
    "cpf_titular",
    "jogos",
    "modalidades",
    "formatos",
    "idiomas",
  ];

  protected static function booted(): void
  {
    static::creating(function (Provedor $provedor) {
      $provedor->codigo ??= (string) Str::uuid();
    });
  }

  // RN06: sem chave, tipo e CPF não há saque
  public function recebimentoCompleto(): bool
  {
    return filled($this->dados) && filled($this->tipo_chave) && filled($this->cpf_titular);
  }

  // RF04: perfil de prestação, sem dados de recebimento
  public function perfil(): array
  {
    return [
      "codigo" => $this->codigo,
      "apresentacao" => $this->apresentacao,
      "jogos" => $this->jogos ?? [],
      "modalidades" => $this->modalidades ?? [],
      "formatos" => $this->formatos ?? [],
      "idiomas" => $this->idiomas ?? [],
    ];
  }

  public function usuario(): BelongsTo
  {
    return $this->belongsTo(Usuario::class, "email", "email");
  }

  public function ofertas(): HasMany
  {
    return $this->hasMany(Oferta::class, "email", "email");
  }
}
