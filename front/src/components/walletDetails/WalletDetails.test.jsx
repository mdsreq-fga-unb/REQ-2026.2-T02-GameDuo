import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WalletDetails from './WalletDetails';
import { api } from '../../services/api';
import { renderizar, respostas } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));

const base = {
  saldo: 10, retido: 85, pendente: 50,
  retidos: [{ contratacao_id: 1, titulo: "Treino de mira", moedas: 85, liberacao_prevista: null }],
  pendentes: [{ cobranca_id: 2, moedas: 50, criada_em: "2026-11-20T12:00:00Z" }],
  recebimentos: null,
};
const recebimentos = {
  disponivel: 100, em_carencia: 59.5, em_saque: 0, a_receber: 0, saque_minimo: 20, dados_completos: true,
  carencias: [{ contratacao_id: 3, titulo: "Duo", valor: 59.5, disponivel_em: "2026-12-24T13:00:00Z" }], previstos: [],
};

describe('WalletDetails', () => {
  beforeEach(() => {
    api.mockReset();
    api.mockImplementation(respostas({
      "/saques": (opcoes) => Promise.resolve(opcoes ? { message: "Saque solicitado!" } : { saques: [{ id: 1, valor: 30, status: "falhou", motivo_falha: "Chave inexistente", solicitado_em: "2026-11-20T12:00:00Z" }] }),
    }));
  });

  it('separa retido e pendente, sem recebimentos para quem não presta serviço', () => {
    renderizar(<WalletDetails carteira={base} onAtualizar={() => {}} />);
    expect(screen.getByText("85 moedas")).toBeInTheDocument();
    expect(screen.getByText("Em análise pela administração")).toBeInTheDocument();
    expect(screen.queryByText("Recebimentos como prestador")).toBeNull();
    expect(api).not.toHaveBeenCalled();
  });

  it('valida o mínimo e só saca depois de confirmar', async () => {
    const atualizar = vi.fn();
    renderizar(<WalletDetails carteira={{ ...base, recebimentos }} onAtualizar={atualizar} />);
    expect(await screen.findByText(/Chave inexistente/)).toBeInTheDocument();

    const campo = screen.getByLabelText("Valor do saque (R$)");
    fireEvent.change(campo, { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: "Solicitar saque" }));
    expect(screen.getByText(/O valor mínimo é/)).toBeInTheDocument();

    fireEvent.change(campo, { target: { value: "60,50" } });
    fireEvent.click(screen.getByRole("button", { name: "Solicitar saque" }));
    expect(api).not.toHaveBeenCalledWith("/saques", expect.anything());
    await act(async () => fireEvent.click(screen.getAllByRole("button", { name: "Solicitar saque" }).at(-1)));
    expect(api).toHaveBeenCalledWith("/saques", { method: "POST", body: { valor: 60.5 } });
    expect(atualizar).toHaveBeenCalled();
  });

  it('pede os dados de recebimento quando faltam', async () => {
    renderizar(<WalletDetails carteira={{ ...base, recebimentos: { ...recebimentos, dados_completos: false } }} onAtualizar={() => {}} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Completar dados" })));
    expect(screen.getByTestId("destino")).toHaveTextContent("/perfil-prestador");
  });
});
