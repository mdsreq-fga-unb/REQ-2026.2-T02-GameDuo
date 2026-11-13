import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PaginaDetalhesOferta from './PaginaDetalhesOferta';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

describe('PaginaDetalhesOferta', () => {
  it('mostra um modal ao tentar contratar', async () => {
    useAuth.mockReturnValue({ loggedIn: true });
    api.mockResolvedValue({ oferta: { id: 1, titulo: "Duo no Valorant", jogo: "Valorant", modalidade: "Duo", duracao: 90, preco: 120, prestador: { nickname: "ana" } } });
    renderizar(<PaginaDetalhesOferta />, { rota: "/oferta/1", caminho: "/oferta/:id" });

    fireEvent.click(await screen.findByRole("button", { name: "Contratar agora" }));
    expect(screen.getByRole("dialog", { name: "Em breve!" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Entendi" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
