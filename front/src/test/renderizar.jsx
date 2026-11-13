import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

function Destino() {
  const location = useLocation();
  return <p data-testid="destino">{location.pathname}|{JSON.stringify(location.state ?? null)}</p>;
}

export function renderizar(elemento, { rota = "/", caminho = "/", estado } = {}) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: rota, state: estado }]}>
      <Routes>
        <Route path={caminho} element={elemento} />
        <Route path="*" element={<Destino />} />
      </Routes>
    </MemoryRouter>,
  );
}

export function respostas(mapa) {
  return (caminho, opcoes) => {
    const resposta = mapa[caminho];
    if (resposta === undefined) return new Promise(() => {});
    return typeof resposta === "function" ? resposta(opcoes) : Promise.resolve(resposta);
  };
}
