import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaginaPagamento from './PaginaPagamento';
import { api, ApiError } from '../../services/api';
import { EVENTO_CARTEIRA } from '../../utils/moedas';
import { renderizar, respostas } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

const base = {
  id: 9,
  pacote: "padrao",
  moedas: 100,
  valor: "100.00",
  forma: "pix",
  status: "pendente",
  link_pagamento: "https://pagamento.test/9",
  pix_copia_cola: null,
  pago_em: null,
  criada_em: "2026-11-12 10:00:00",
};
const pix = { qrcode: "QUJD", copia_cola: "00020126pix", expira_em: "2026-11-13 10:00:00" };

const abrir = (estado) => renderizar(<PaginaPagamento />, { rota: "/pagamento/9", caminho: "/pagamento/:id", estado });
const servidor = (cobranca, extra = {}) => api.mockImplementation(respostas({ "/checkout/9": { cobranca }, ...extra }));

describe('PaginaPagamento', () => {
  beforeEach(() => {
    api.mockReset();
  });

  it('mostra carregando enquanto busca o pedido', () => {
    api.mockImplementation(respostas({}));
    abrir();
    expect(screen.getByText("Carregando seu pedido...")).toBeInTheDocument();
  });

  it('mostra o Pix com QR Code, copia o código e volta ao normal depois', async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    servidor(base);
    abrir({ cobranca: base, pix });

    expect(screen.getByRole("heading", { name: "Pague com Pix" })).toBeInTheDocument();
    expect(screen.getByAltText("QR Code Pix para pagamento")).toHaveAttribute("src", "data:image/png;base64,QUJD");
    expect(screen.getByText(/Válido até 13\/11\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/Pode fechar esta tela/)).toBeInTheDocument();

    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /Copiar/ })));
    expect(writeText).toHaveBeenCalledWith("00020126pix");
    expect(screen.getByRole("button", { name: /Copiado!/ })).toHaveClass("is-done");

    act(() => vi.advanceTimersByTime(2500));
    expect(screen.getByRole("button", { name: /Copiar/ })).not.toHaveClass("is-done");
    fireEvent.focus(screen.getByLabelText("Pix copia e cola"));
  });

  it('sem QR Code usa o código do pedido e copia mesmo sem acesso à área de transferência', async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    document.execCommand = vi.fn();
    const cobranca = { ...base, pix_copia_cola: "00020126pedido" };
    servidor(cobranca);
    abrir({ cobranca, pix: null });

    expect(screen.getByText("Use o código copia e cola abaixo para pagar.")).toBeInTheDocument();
    expect(screen.getByLabelText("Pix copia e cola")).toHaveValue("00020126pedido");
    expect(screen.queryByText(/Válido até/)).toBeNull();

    await act(async () => fireEvent.click(screen.getByRole("button", { name: /Copiar/ })));
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByRole("button", { name: /Copiado!/ })).toBeInTheDocument();
  });

  it('esconde o copia e cola quando não há código', () => {
    servidor(base);
    abrir({ cobranca: base });
    expect(screen.queryByLabelText("Pix copia e cola")).toBeNull();
  });

  it('mostra o link do cartão ou um erro quando ele falta', () => {
    const cartao = { ...base, forma: "cartao" };
    servidor(cartao);
    const { unmount } = abrir({ cobranca: cartao });
    expect(screen.getByRole("heading", { name: "Pague com cartão" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pagar com cartão/ })).toHaveAttribute("href", "https://pagamento.test/9");
    unmount();

    const semLink = { ...cartao, link_pagamento: null };
    servidor(semLink);
    abrir({ cobranca: semLink });
    expect(screen.getByText(/Não foi possível abrir o pagamento/)).toBeInTheDocument();
  });

  it('o botão Já paguei confere na hora e mostra a confirmação com o saldo', async () => {
    const ouvinte = vi.fn();
    window.addEventListener(EVENTO_CARTEIRA, ouvinte);
    servidor(base);
    abrir({ cobranca: base, pix });
    await act(async () => {});

    let liberar;
    api.mockImplementation(respostas({
      "/checkout/9": () => new Promise((ok) => {
        liberar = () => ok({ cobranca: { ...base, status: "paga", pago_em: "2026-11-12 10:05:00" } });
      }),
      "/carteira": { saldo: 370 },
    }));
    fireEvent.click(screen.getByRole("button", { name: "Já paguei" }));
    expect(screen.getByRole("button", { name: "Verificando..." })).toBeDisabled();

    await act(async () => liberar());
    expect(screen.getByRole("heading", { name: "Moedas na conta!" })).toBeInTheDocument();
    expect(screen.getByText("+100")).toBeInTheDocument();
    expect(await screen.findByText("370 moedas")).toBeInTheDocument();
    expect(screen.queryByText(/Pode fechar esta tela/)).toBeNull();
    expect(ouvinte).toHaveBeenCalledOnce();
    window.removeEventListener(EVENTO_CARTEIRA, ouvinte);

    fireEvent.click(screen.getByRole("button", { name: "Explorar ofertas" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/|");
  });

  it('pedido pago sem conseguir buscar o saldo ainda mostra a confirmação', async () => {
    const paga = { ...base, status: "paga", pago_em: "2026-11-12 10:05:00" };
    api.mockImplementation(respostas({ "/checkout/9": { cobranca: paga }, "/carteira": () => Promise.reject(new ApiError(500, "x")) }));
    abrir();

    expect(await screen.findByText("Pagamento confirmado")).toBeInTheDocument();
    expect(screen.queryByText(/Saldo atual/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Ver carteira" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/carteira");
  });

  it('pedido vencido oferece uma nova compra', async () => {
    servidor({ ...base, status: "vencida" });
    abrir();
    expect(await screen.findByText(/O tempo para pagar acabou\. Você não foi cobrado\./)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pedido não concluído" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Fazer nova compra" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/comprar-moedas");
  });

  it('pedido cancelado leva de volta à carteira', async () => {
    servidor({ ...base, status: "cancelada" });
    abrir();
    expect(await screen.findByText(/Este pedido foi cancelado\./)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ver carteira" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/carteira");
  });

  it('mostra status e forma desconhecidos sem quebrar', async () => {
    servidor({ ...base, status: "estornada", forma: "boleto" });
    abrir();
    expect(await screen.findByText("estornada")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pagamento" })).toBeInTheDocument();
    expect(screen.getByText("boleto")).toBeInTheDocument();
  });

  it('avisa quando o pedido não existe', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(404, "Não encontrado.")));
    abrir();
    expect(await screen.findByText("Não encontramos este pedido.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Comprar moedas" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/comprar-moedas");
  });

  it('manda para o login quando a sessão expirou', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(401, "Não autenticado.")));
    abrir();
    expect(await screen.findByTestId("destino")).toHaveTextContent('/login|{"voltarPara":"/pagamento/9"}');
  });

  it('mostra um aviso quando a consulta falha e mantém o pedido na tela', async () => {
    api.mockImplementation(() => Promise.reject(new ApiError(0, "Sem conexão no momento.")));
    abrir({ cobranca: base, pix });
    expect(await screen.findByText("Sem conexão no momento.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pague com Pix" })).toBeInTheDocument();
  });

  it('confere sozinho a cada 5 segundos e ao voltar para a aba', async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    servidor(base);
    const { unmount } = abrir({ cobranca: base, pix });
    await act(async () => {});
    expect(api).toHaveBeenCalledTimes(1);

    await act(async () => vi.advanceTimersByTime(5000));
    expect(api).toHaveBeenCalledTimes(2);

    await act(async () => window.dispatchEvent(new Event("focus")));
    expect(api).toHaveBeenCalledTimes(3);

    unmount();
    vi.advanceTimersByTime(5000);
    expect(api).toHaveBeenCalledTimes(3);
  });

  it('volta para a carteira', () => {
    api.mockImplementation(respostas({}));
    abrir();
    fireEvent.click(screen.getByRole("button", { name: "← Voltar à carteira" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/carteira");
  });
});
