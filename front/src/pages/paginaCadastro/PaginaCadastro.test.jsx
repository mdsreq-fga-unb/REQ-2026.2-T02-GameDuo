import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaCadastro from './PaginaCadastro';
import { api } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));

function preencher(senha) {
  fireEvent.change(screen.getByPlaceholderText("Nickname/Apelido"), { target: { value: "jogador" } });
  fireEvent.change(screen.getByPlaceholderText("Seu nome"), { target: { value: "Jogador" } });
  fireEvent.change(screen.getByPlaceholderText("Digite seu e-mail"), { target: { value: "jogador@gameduo.test" } });
  fireEvent.change(screen.getByPlaceholderText("Crie sua senha"), { target: { value: senha } });
  fireEvent.change(screen.getByPlaceholderText("Repita sua senha"), { target: { value: senha } });
  fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
}

describe('PaginaCadastro', () => {
  beforeEach(() => {
    api.mockReset();
    api.mockResolvedValue({});
  });

  it('não deixa criar conta com senha fraca', () => {
    renderizar(<PaginaCadastro />, { rota: "/cadastro", caminho: "/cadastro" });
    preencher("senha1234");

    expect(screen.getByText("Complete todos os itens da senha forte.")).toBeInTheDocument();
    expect(screen.getByText("Um símbolo especial")).not.toHaveClass("done");
    expect(api).not.toHaveBeenCalled();
  });

  it('cria a conta quando a senha cumpre todas as regras', async () => {
    renderizar(<PaginaCadastro />, { rota: "/cadastro", caminho: "/cadastro" });
    preencher("Senha@2026");

    expect(await screen.findByTestId("destino")).toHaveTextContent("/login");
    expect(api).toHaveBeenCalledWith("/usuarios", expect.objectContaining({ method: "POST" }));
  });
});
