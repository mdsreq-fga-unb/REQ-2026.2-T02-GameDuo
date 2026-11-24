import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaMinhasOfertas from './PaginaMinhasOfertas';
import { api } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

const oferta = { id: 2, titulo: "Mira no CS2", descricao: null, jogo: "Counter-Strike 2", modalidade: "Coaching", nivel: null, duracao: 60, preco: 80 };

describe('PaginaMinhasOfertas', () => {
  beforeEach(() => {
    api.mockReset();
    api.mockImplementation((caminho, opcoes) => {
      if (caminho === "/jogos") return Promise.resolve({ jogos: ["Counter-Strike 2"] });
      if (opcoes?.method === "DELETE") return Promise.resolve({ message: "Oferta encerrada." });
      return Promise.resolve({ ofertas: [oferta] });
    });
  });

  it('encerra a oferta só depois de confirmar no modal', async () => {
    renderizar(<PaginaMinhasOfertas />, { rota: "/minhas-ofertas", caminho: "/minhas-ofertas" });
    fireEvent.click(await screen.findByRole("button", { name: "Encerrar" }));

    expect(screen.getByRole("dialog", { name: "Encerrar oferta?" })).toHaveTextContent("Mira no CS2");
    fireEvent.click(screen.getByRole("button", { name: "Manter oferta" }));
    expect(api).not.toHaveBeenCalledWith("/ofertas/2", { method: "DELETE" });

    fireEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Encerrar oferta" })));
    expect(api).toHaveBeenCalledWith("/ofertas/2", { method: "DELETE" });
    expect(screen.getByText("Oferta encerrada.")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it('marca a oferta que está sendo editada', async () => {
    renderizar(<PaginaMinhasOfertas />, { rota: "/minhas-ofertas", caminho: "/minhas-ofertas" });
    fireEvent.click(await screen.findByRole("button", { name: "Editar" }));
    expect(screen.getByRole("button", { name: "Editando" })).toBeDisabled();
  });
});
