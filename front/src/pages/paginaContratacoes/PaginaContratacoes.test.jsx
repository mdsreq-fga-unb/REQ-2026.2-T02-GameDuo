import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaContratacoes from './PaginaContratacoes';
import { api } from '../../services/api';
import { renderizar, respostas } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

const sessao = {
  id: 7, papel: "consumidor", titulo: "Treino de mira", jogo: "CS2", modalidade: "Coaching", duracao: 60, preco: 85,
  comunicacao: "Discord", inicio: "2026-11-24T12:00:00Z", status: "agendada", outra_parte: { nickname: "coach", contato: "coach#1" },
  prazo_resultado: "2026-11-26T13:00:00Z", pode_cancelar: true, pode_registrar: false, email_sac: "sac@x.com",
};

const abrir = (dados) => {
  api.mockImplementation(respostas({
    "/contratacoes": { contratacoes: [{ ...sessao, ...dados }] },
    "/contratacoes/7/cancelar": { message: "Contratação cancelada." },
    "/contratacoes/7/resultado": { message: "Resultado registrado." },
  }));
  renderizar(<PaginaContratacoes />, { rota: "/contratacoes", caminho: "/contratacoes" });
};

describe('PaginaContratacoes', () => {
  beforeEach(() => {
    api.mockReset();
  });

  it('mostra o contato e cancela só depois de confirmar', async () => {
    abrir({});
    expect(await screen.findByText("coach#1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar sessão" }));
    expect(api).not.toHaveBeenCalledWith("/contratacoes/7/cancelar", expect.anything());
    await act(async () => fireEvent.click(screen.getAllByRole("button", { name: "Cancelar sessão" }).at(-1)));
    expect(api).toHaveBeenCalledWith("/contratacoes/7/cancelar", { method: "POST" });
    expect(screen.getByText("Contratação cancelada.")).toBeInTheDocument();
  });

  it('exige justificativa ao informar problema', async () => {
    abrir({ pode_cancelar: false, pode_registrar: true });
    fireEvent.click(await screen.findByRole("button", { name: "Teve problemas" }));
    fireEvent.click(screen.getByRole("button", { name: "Registrar" }));
    expect(screen.getByText("Conte o que aconteceu.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/O que aconteceu/), { target: { value: "Caiu a conexão" } });
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Registrar" })));
    expect(api).toHaveBeenCalledWith("/contratacoes/7/resultado", { method: "POST", body: { resultado: "problema", justificativa: "Caiu a conexão" } });
  });

  it('orienta o SAC quando está em análise', async () => {
    abrir({ status: "em_analise", pode_cancelar: false, meu_resultado: "problema" });
    expect(await screen.findByText(/sac@x.com/)).toBeInTheDocument();
  });
});
