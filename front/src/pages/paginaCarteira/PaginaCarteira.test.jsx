import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaCarteira from './PaginaCarteira';
import { api, ApiError } from '../../services/api';
import { renderizar, respostas } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

const abrir = () => renderizar(<PaginaCarteira />, { rota: "/carteira", caminho: "/carteira" });

describe('PaginaCarteira', () => {
  beforeEach(() => {
    api.mockReset();
  });

  it('mostra carregando enquanto busca os dados', () => {
    api.mockImplementation(respostas({}));
    abrir();
    expect(screen.getByText("Carregando sua carteira...")).toBeInTheDocument();
  });

  it('mostra saldo e extrato com entradas e saídas', async () => {
    api.mockImplementation(respostas({
      "/carteira": { saldo: 1250 },
      "/carteira/extrato": {
        movimentos: [
          { id: 1, tipo: "compra", moedas: 100, descricao: "Compra do pacote padrao", data: "2026-11-12 10:00:00" },
          { id: 2, tipo: "contratacao", moedas: -80, descricao: "Coaching de CS2", data: "2026-11-12 11:00:00" },
          { id: 3, tipo: "bonus", moedas: 5, descricao: "Bônus", data: "2026-11-12 12:00:00" },
        ],
      },
    }));
    abrir();

    expect(await screen.findByText("1.250")).toBeInTheDocument();
    expect(screen.getByText("3 movimentos")).toBeInTheDocument();
    expect(screen.getByText("Compra de 100 moedas")).toBeInTheDocument();
    expect(screen.getByText("Coaching de CS2")).toBeInTheDocument();
    expect(screen.getByText("−80")).toHaveClass("is-negative");
    expect(screen.getByText("bonus")).toBeInTheDocument();
  });

  it('mostra o estado vazio e leva para a compra', async () => {
    api.mockImplementation(respostas({ "/carteira": { saldo: 0 }, "/carteira/extrato": { movimentos: [] } }));
    abrir();

    expect(await screen.findByText("Nenhuma movimentação ainda")).toBeInTheDocument();
    expect(screen.getByText("0 movimentos")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Comprar moedas" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/comprar-moedas");
  });

  it('usa o singular com um movimento e volta ao catálogo', async () => {
    api.mockImplementation(respostas({
      "/carteira": { saldo: 50 },
      "/carteira/extrato": { movimentos: [{ id: 1, tipo: "devolucao", moedas: 50, descricao: "Devolução", data: null }] },
    }));
    abrir();

    expect(await screen.findByText("1 movimento")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "← Voltar ao catálogo" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/|");
  });

  it('manda para o login quando a sessão expirou', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(401, "Não autenticado.")));
    abrir();
    expect(await screen.findByTestId("destino")).toHaveTextContent('/login|{"voltarPara":"/carteira"}');
  });

  it('mostra a mensagem de erro', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(500, "Algo deu errado.")));
    abrir();
    expect(await screen.findByText("Algo deu errado.")).toBeInTheDocument();
    expect(screen.queryByText("Carregando sua carteira...")).toBeNull();
  });
});
