<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;


class Usuario extends Authenticatable implements JWTSubject
{
  protected $table = "Usuario";
  protected $primaryKey = "email";

  public $incrementing = false;

  protected $keyType = "string";

  public $timestamps = false;

  protected $hidden = [

  "senha",
  ];

  protected $fillable = [
    "email",
    "nome",
    "senha",
    "nickname",
  ];

  public function provedor(): HasOne
  {
    return $this->hasOne(Provedor::class, "email", "email");
  }

  // usa a relação carregada: o middleware e o resumo() consultam o banco uma vez só
  public function ehPrestador(): bool
  {
    return $this->provedor !== null;
  }

  // dados do usuário devolvidos pela API (login e /me)
  public function resumo(): array
  {
    return [
      "email" => $this->email,
      "nome" => $this->nome,
      "nickname" => $this->nickname,
      "prestador" => $this->ehPrestador(),
    ];
  }

  public function getAuthPasswordName(): string
  {
    return "senha";
  }

  // identificador gravado no token (o e-mail, que é a chave primária)
  public function getJWTIdentifier(): mixed
  {
    return $this->getKey();
  }

  public function getJWTCustomClaims(): array
  {
    return [];
  }
}
