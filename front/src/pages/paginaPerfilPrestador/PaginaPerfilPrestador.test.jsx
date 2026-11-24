import { screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import PaginaPerfilPrestador from './PaginaPerfilPrestador';
import { api } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

it('mostra o perfil e avisa que o nível é declarado', async () => {
  api.mockResolvedValue({ prestador: { nickname: "coach", apresentacao: "Oi", jogos: [{ jogo: "CS2", nivel: "Faceit 10" }], modalidades: ["Duo"], formatos: [], idiomas: [], ofertas: [] } });
  renderizar(<PaginaPerfilPrestador />, { rota: "/prestador/abc", caminho: "/prestador/:codigo" });
  expect(await screen.findByText("@coach")).toBeInTheDocument();
  expect(screen.getByText(/Faceit 10/)).toBeInTheDocument();
  expect(screen.getByText(/não é verificado/)).toBeInTheDocument();
});
