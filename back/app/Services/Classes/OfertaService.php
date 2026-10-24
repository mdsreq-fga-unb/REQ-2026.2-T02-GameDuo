<?php

namespace App\Services\Classes;

use App\Models\Oferta;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class OfertaService
{
    public function listar(): Collection
    {
        return Oferta::with('usuario')->latest('id')->get();
    }

    public function listarDoPrestador(Usuario $usuario): Collection
    {
        return Oferta::with('usuario')
            ->where('email', $usuario->email)
            ->latest('id')
            ->get();
    }

    public function criar(Usuario $usuario, array $dados): Oferta
    {
        $oferta = new Oferta($dados);
        $oferta->email = $usuario->email;
        $oferta->save();

        return $oferta->load('usuario');
    }

    public function atualizar(Oferta $oferta, array $dados): Oferta
    {
        $oferta->update($dados);

        return $oferta->load('usuario');
    }

    public function excluir(Oferta $oferta): void
    {
        $oferta->delete();
    }

    public function pertenceA(Oferta $oferta, Usuario $usuario): bool
    {
        return $oferta->email === $usuario->email;
    }
}
