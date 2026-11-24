import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PaginaDetalhesOferta from './PaginaDetalhesOferta';
import { api } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));
vi.mock('../../components/hireCard/HireCard', () => ({ default: ({ offer }) => <p>contratar {offer.id}</p> }));

describe('PaginaDetalhesOferta', () => {
  it('mostra comunicação e condições e leva ao perfil do prestador', async () => {
    api.mockResolvedValue({ oferta: { id: 1, titulo: "Duo no Valorant", jogo: "Valorant", modalidade: "Duo", duracao: 90, preco: 120, comunicacao: "Discord", condicoes: "Ter microfone", prestador: { nickname: "ana", codigo: "abc" } } });
    renderizar(<PaginaDetalhesOferta />, { rota: "/oferta/1", caminho: "/oferta/:id" });

    expect(await screen.findByText("contratar 1")).toBeInTheDocument();
    expect(screen.getByText(/Discord/)).toBeInTheDocument();
    expect(screen.getByText(/Ter microfone/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ver perfil" }));
    expect(screen.getByTestId("destino")).toHaveTextContent("/prestador/abc");
  });
});
