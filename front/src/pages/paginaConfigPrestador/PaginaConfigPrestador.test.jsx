import { act, fireEvent, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import PaginaConfigPrestador from './PaginaConfigPrestador';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { renderizar } from '../../test/renderizar';

vi.mock('../../services/api', async (original) => ({ ...(await original()), api: vi.fn() }));
vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../components/mainLayout/MainLayout', () => ({ default: ({ children }) => <>{children}</> }));

it('ativa o prestador com perfil e dados de recebimento', async () => {
  const setUsuario = vi.fn();
  useAuth.mockReturnValue({ usuario: { prestador: false }, setUsuario });
  api.mockImplementation((caminho) => Promise.resolve(caminho === "/jogos" ? { jogos: ["CS2"] } : { message: "Ativado!", usuario: { prestador: true } }));
  renderizar(<PaginaConfigPrestador />);

  fireEvent.click(await screen.findByLabelText("CS2"));
  fireEvent.change(screen.getByLabelText(/Seu nível em CS2/), { target: { value: "Faceit 10" } });
  fireEvent.change(screen.getByLabelText("Apresentação"), { target: { value: "Coach" } });
  ["Coaching", "Individual", "Português"].forEach((opcao) => fireEvent.click(screen.getByLabelText(opcao)));
  fireEvent.change(screen.getByLabelText("Tipo da chave Pix"), { target: { value: "E-mail" } });
  fireEvent.change(screen.getByLabelText("Chave Pix"), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByLabelText("CPF do titular"), { target: { value: "52998224725" } });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Ativar perfil de prestador" })));

  expect(api).toHaveBeenLastCalledWith("/prestador", { method: "POST", body: {
    apresentacao: "Coach", jogos: [{ jogo: "CS2", nivel: "Faceit 10" }], modalidades: ["Coaching"], formatos: ["Individual"], idiomas: ["Português"],
    tipo_chave: "EMAIL", dados: "a@b.com", cpf_titular: "529.982.247-25",
  } });
  expect(setUsuario).toHaveBeenCalledWith({ prestador: true });
});
