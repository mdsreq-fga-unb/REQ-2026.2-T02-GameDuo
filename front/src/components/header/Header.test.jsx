import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { renderizar } from '../../test/renderizar';

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../coinBalance/CoinBalance', () => ({ default: () => null }));

describe('Header', () => {
  it('pede confirmação antes de sair', async () => {
    const sair = vi.fn().mockResolvedValue();
    useAuth.mockReturnValue({ usuario: { nome: "Ana", nickname: "ana", prestador: false }, sair });
    renderizar(<Header />, { rota: "/carteira", caminho: "/carteira" });

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(screen.getByRole("dialog", { name: "Sair da conta?" })).toBeInTheDocument();
    expect(sair).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Continuar aqui" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    await act(async () => fireEvent.click(screen.getAllByRole("button", { name: "Sair" }).at(-1)));
    expect(sair).toHaveBeenCalledOnce();
    expect(screen.getByTestId("destino")).toHaveTextContent("/|");
  });
});
