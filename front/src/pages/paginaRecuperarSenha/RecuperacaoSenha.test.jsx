import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaRecuperarSenha from './PaginaRecuperarSenha';
import PaginaValidarCodigo from '../paginaValidarCodigo/PaginaValidarCodigo';
import PaginaNovaSenha from '../paginaNovaSenha/PaginaNovaSenha';
import { api, ApiError } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));

const clicar = (nome) => act(async () => fireEvent.click(screen.getByRole("button", { name: nome })));

describe('Recuperação de senha', () => {
  beforeEach(() => {
    api.mockReset();
    api.mockResolvedValue({ message: "ok" });
  });

  it('pede o código por e-mail', async () => {
    renderizar(<PaginaRecuperarSenha />);
    fireEvent.change(screen.getByLabelText("E-mail cadastrado"), { target: { value: "ana@x.com" } });
    await clicar("Enviar código");
    expect(api).toHaveBeenCalledWith("/senha/solicitar", { method: "POST", body: { email: "ana@x.com" } });
    expect(screen.getByTestId("destino")).toHaveTextContent("/validar-codigo");
  });

  it('valida o código no servidor', async () => {
    renderizar(<PaginaValidarCodigo />, { rota: "/validar-codigo", caminho: "/validar-codigo", estado: { email: "ana@x.com" } });
    fireEvent.change(screen.getByLabelText("Digite o código recebido"), { target: { value: "123456" } });
    api.mockRejectedValueOnce(new ApiError(422, "Código inválido"));
    await clicar("Validar código");
    expect(screen.getByText("Código inválido")).toBeInTheDocument();
    await clicar("Validar código");
    expect(screen.getByTestId("destino")).toHaveTextContent("/nova-senha");
  });

  it('sem e-mail volta para o começo', () => {
    renderizar(<PaginaValidarCodigo />, { rota: "/validar-codigo", caminho: "/validar-codigo" });
    expect(screen.getByTestId("destino")).toHaveTextContent("/recuperar-senha");
  });

  it('salva a nova senha', async () => {
    renderizar(<PaginaNovaSenha />, { rota: "/nova-senha", caminho: "/nova-senha", estado: { email: "ana@x.com", codigo: "123456" } });
    fireEvent.change(screen.getByLabelText(/^Nova senha/), { target: { value: "NovaSenha1!" } });
    fireEvent.change(screen.getByLabelText(/^Confirmar nova senha/), { target: { value: "NovaSenha1!" } });
    await clicar("Salvar senha");
    expect(api).toHaveBeenCalledWith("/senha/redefinir", { method: "POST", body: { email: "ana@x.com", codigo: "123456", senha: "NovaSenha1!", senha_confirmation: "NovaSenha1!" } });
    expect(screen.getByTestId("destino")).toHaveTextContent("/senha-alterada");
  });
});
