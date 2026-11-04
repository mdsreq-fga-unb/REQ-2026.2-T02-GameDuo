import { useEffect, useState } from 'react';
import { api } from '../services/api';

// Jogos ativos do catálogo (RF50), mantidos pelo admin em /admin/jogos.
// Devolve [] enquanto carrega ou se a API falhar (o filtro fica só com "Todos").
export function useJogosAtivos() {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    let atual = true;
    api("/jogos")
      .then((data) => atual && setJogos(data.jogos))
      .catch(() => {});

    return () => {
      atual = false;
    };
  }, []);

  return jogos;
}
