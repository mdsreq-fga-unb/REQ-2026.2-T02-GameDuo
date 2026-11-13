import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaAdminJogos from './PaginaAdminJogos';
import { api } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

describe('PaginaAdminJogos', () => {
  beforeEach(() => {
    api.mockReset();
    api.mockImplementation((caminho, opcoes) => Promise.resolve(
      opcoes?.method === "DELETE" ? { message: "Jogo excluído." } : { jogos: [{ id: 1, nome: "Valorant", ativo: true }] },
    ));
  });

  it('exclui o jogo depois de confirmar no modal', async () => {
    renderizar(<PaginaAdminJogos />, { rota: "/admin/jogos", caminho: "/admin/jogos" });
    fireEvent.click(await screen.findByRole("button", { name: "Excluir" }));
    expect(screen.getByRole("dialog", { name: "Excluir jogo?" })).toHaveTextContent("Valorant");

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Excluir jogo" })));
    expect(api).toHaveBeenCalledWith("/admin/jogos/1", { method: "DELETE" });
    expect(screen.getByText("Jogo excluído.")).toBeInTheDocument();
    expect(screen.queryByText("Valorant")).toBeNull();
  });
});
