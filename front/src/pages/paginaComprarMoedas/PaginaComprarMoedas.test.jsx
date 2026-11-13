import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaComprarMoedas from './PaginaComprarMoedas';
import { api, ApiError } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

const abrir = () => renderizar(<PaginaComprarMoedas />, { rota: "/comprar-moedas", caminho: "/comprar-moedas" });
const cpf = () => screen.getByPlaceholderText("000.000.000-00");
const enviar = () => fireEvent.submit(document.querySelector("form"));

describe('PaginaComprarMoedas', () => {
  beforeEach(() => {
    api.mockReset();
  });

  it('começa no pacote padrão com Pix e atualiza o resumo', () => {
    abrir();
    const resumo = document.querySelector(".order-summary");
    expect(within(resumo).getByText("Padrão")).toBeInTheDocument();
    expect(within(resumo).getByText(/R\$\s100,00/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gerar Pix" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /Pro/ }));
    fireEvent.click(screen.getByRole("radio", { name: /Cartão/ }));
    expect(within(resumo).getByText(/R\$\s500,00/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "← Voltar à carteira" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/carteira");
  });

  it('mascara o CPF e recusa CPF incompleto', () => {
    abrir();
    fireEvent.change(cpf(), { target: { value: "1234567" } });
    expect(cpf()).toHaveValue("123.456.7");
    enviar();
    expect(screen.getByText("O CPF deve ter 11 dígitos.")).toBeInTheDocument();
    expect(api).not.toHaveBeenCalled();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('gera a cobrança e vai para o pagamento', async () => {
    api.mockResolvedValue({ cobranca: { id: 7 }, pix: { qrcode: "abc" } });
    abrir();
    fireEvent.change(cpf(), { target: { value: "52998224725" } });
    enviar();

    expect(screen.getByRole("button", { name: "Preparando pagamento..." })).toBeDisabled();
    expect(await screen.findByTestId("destino")).toHaveTextContent('/pagamento/7|{"cobranca":{"id":7},"pix":{"qrcode":"abc"}}');
    expect(api).toHaveBeenCalledWith("/checkout", { method: "POST", body: { pacote: "padrao", forma: "pix", cpf: "52998224725" } });
  });

  it('envia sem CPF e pede o CPF quando o servidor exige', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(422, "Dados inválidos.", { cpf: ["Informe o CPF para a primeira compra."] })));
    abrir();
    enviar();

    expect(await screen.findByText("Informe seu CPF para continuar.")).toBeInTheDocument();
    expect(api).toHaveBeenCalledWith("/checkout", { method: "POST", body: { pacote: "padrao", forma: "pix" } });
    expect(screen.queryByText("Dados inválidos.")).toBeNull();
  });

  it('mostra os erros de cada campo vindos do servidor', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(422, "Dados inválidos.", {
      cpf: ["CPF inválido."],
      pacote: ["Pacote inválido."],
      forma: ["Forma inválida."],
    })));
    abrir();
    fireEvent.change(cpf(), { target: { value: "11111111111" } });
    enviar();

    expect(await screen.findByText("CPF inválido.")).toBeInTheDocument();
    expect(screen.getByText("Pacote inválido.")).toBeInTheDocument();
    expect(screen.getByText("Forma inválida.")).toBeInTheDocument();
  });

  it('mostra a falha geral e libera o botão de novo', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(502, "Não foi possível gerar o pagamento.")));
    abrir();
    enviar();

    expect(await screen.findByText("Não foi possível gerar o pagamento.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gerar Pix" })).toBeEnabled();
  });

  it('manda para o login quando a sessão expirou', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(401, "Não autenticado.")));
    abrir();
    enviar();
    expect(await screen.findByTestId("destino")).toHaveTextContent('/login|{"voltarPara":"/comprar-moedas"}');
  });
});
