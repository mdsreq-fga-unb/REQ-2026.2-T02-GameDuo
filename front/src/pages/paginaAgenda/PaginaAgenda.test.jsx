import { act, fireEvent, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import PaginaAgenda from './PaginaAgenda';
import { api } from '../../services/api';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

it('adiciona um intervalo e salva a agenda', async () => {
  const intervalos = [{ dia: 2, inicio: "09:00", fim: "11:00" }];
  api.mockImplementation((caminho, opcoes) => Promise.resolve(opcoes ? { message: "Agenda salva!", intervalos } : { oferta: { titulo: "Mira", duracao: 60 }, intervalos: [] }));
  renderizar(<PaginaAgenda />, { rota: "/minhas-ofertas/4/agenda", caminho: "/minhas-ofertas/:id/agenda" });

  fireEvent.click(await screen.findByRole("button", { name: "Adicionar horário em Terça" }));
  fireEvent.click(screen.getByRole("button", { name: "Salvar agenda" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Preencha o início");

  fireEvent.change(screen.getByLabelText("Início em Terça"), { target: { value: "09:00" } });
  fireEvent.change(screen.getByLabelText("Fim em Terça"), { target: { value: "11:00" } });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Salvar agenda" })));
  expect(api).toHaveBeenLastCalledWith("/ofertas/4/agenda", { method: "PUT", body: { intervalos } });
  expect(screen.getByText("Agenda salva!")).toBeInTheDocument();
});
