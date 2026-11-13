import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CoinBalance from './CoinBalance';
import { api } from '../../services/api';
import { avisarCarteiraAtualizada } from '../../utils/moedas';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', () => ({ api: vi.fn() }));

describe('CoinBalance', () => {
  beforeEach(() => {
    api.mockReset();
  });

  it('mostra o saldo e leva para a carteira', async () => {
    api.mockResolvedValue({ saldo: 1200 });
    renderizar(<CoinBalance />);
    expect(screen.getByRole("button", { name: "Abrir carteira" })).toHaveTextContent("···");

    const botao = await screen.findByRole("button", { name: "Carteira: 1200 moedas" });
    expect(botao).toHaveTextContent("1.200");
    expect(botao).not.toHaveClass("is-updated");

    fireEvent.click(botao);
    expect(screen.getByTestId("destino")).toHaveTextContent("/carteira");
  });

  it('pulsa quando o saldo muda e não pulsa quando continua igual', async () => {
    api.mockResolvedValueOnce({ saldo: 100 }).mockResolvedValueOnce({ saldo: 100 }).mockResolvedValueOnce({ saldo: 200 });
    renderizar(<CoinBalance />);
    await screen.findByRole("button", { name: "Carteira: 100 moedas" });

    await act(async () => avisarCarteiraAtualizada());
    expect(screen.getByRole("button", { name: "Carteira: 100 moedas" })).not.toHaveClass("is-updated");

    await act(async () => avisarCarteiraAtualizada());
    expect(screen.getByRole("button", { name: "Carteira: 200 moedas" })).toHaveClass("is-updated");
  });

  it('some quando não consegue carregar', async () => {
    api.mockImplementation(() => Promise.reject(new Error("falhou")));
    renderizar(<CoinBalance />);
    await act(async () => {});
    expect(screen.queryByRole("button")).toBeNull();
  });

  it('ignora respostas que chegam depois de sair da tela', async () => {
    let responder;
    let falhar;
    api.mockReturnValueOnce(new Promise((ok) => { responder = ok; })).mockReturnValueOnce(new Promise((_, erro) => { falhar = erro; }));
    const { unmount } = renderizar(<CoinBalance />);
    avisarCarteiraAtualizada();
    unmount();
    await act(async () => {
      responder({ saldo: 10 });
      falhar(new Error("x"));
    });
    expect(api).toHaveBeenCalledTimes(2);
  });
});
