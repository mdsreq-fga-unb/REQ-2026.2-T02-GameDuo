import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HireCard from './HireCard';
import { api, ApiError } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }));

const offer = { id: 1, title: "Duo", price: 120, communication: "Discord" };
const vaga = { inicio: "2026-11-24T12:00:00Z", fim: "2026-11-24T13:00:00Z" };
let contratar;

const escolher = async () => {
  renderizar(<HireCard offer={offer} />, { rota: "/oferta/1", caminho: "/oferta/:id" });
  fireEvent.click(await screen.findByRole("button", { name: "09:00" }));
  fireEvent.change(screen.getByLabelText(/Seu contato/), { target: { value: "ana#1" } });
  fireEvent.click(screen.getByRole("button", { name: "Contratar agora" }));
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Contratar" })));
};

describe('HireCard', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ loggedIn: true });
    contratar = () => Promise.resolve({ message: "Sessão contratada!" });
    api.mockReset();
    api.mockImplementation((caminho) => (caminho === "/contratacoes" ? contratar() : Promise.resolve({ vagas: [vaga] })));
  });

  it('contrata o horário escolhido depois de confirmar', async () => {
    await escolher();
    expect(api).toHaveBeenCalledWith("/contratacoes", { method: "POST", body: { oferta_id: 1, inicio: vaga.inicio, contato: "ana#1", preco: 120 } });
    expect(screen.getByTestId("destino")).toHaveTextContent("/contratacoes");
  });

  it('avisa e recarrega quando o horário foi ocupado', async () => {
    contratar = () => Promise.reject(new ApiError(409, "Este horário não está mais disponível."));
    await escolher();
    expect(screen.getByText("Este horário não está mais disponível.")).toBeInTheDocument();
    expect(api.mock.calls.filter(([caminho]) => caminho === "/ofertas/1/vagas")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Contratar agora" })).toBeDisabled();
  });

  it('visitante vê os horários e é levado ao login', async () => {
    useAuth.mockReturnValue({ loggedIn: false });
    renderizar(<HireCard offer={offer} />, { rota: "/oferta/1", caminho: "/oferta/:id" });
    expect(await screen.findByRole("button", { name: "09:00" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Entrar para contratar" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/login");
  });

  it('informa quando não há horários livres', async () => {
    api.mockResolvedValue({ vagas: [] });
    renderizar(<HireCard offer={offer} />, { rota: "/oferta/1", caminho: "/oferta/:id" });
    expect(await screen.findByText(/Sem horários livres/)).toBeInTheDocument();
  });
});
