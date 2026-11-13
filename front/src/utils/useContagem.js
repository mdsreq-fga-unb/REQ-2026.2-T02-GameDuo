import { useEffect, useRef, useState } from 'react';

const prefereMenosMovimento = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function useContagem(alvo, duracao = 700) {
  const [valor, setValor] = useState(0);
  const atual = useRef(0);

  useEffect(() => {
    if (alvo === null || alvo === undefined) return undefined;
    const inicio = atual.current;

    if (inicio === alvo || prefereMenosMovimento()) {
      atual.current = alvo;
      setValor(alvo);
      return undefined;
    }

    let quadro;
    const comeco = performance.now();
    const passo = (agora) => {
      const progresso = Math.min((agora - comeco) / duracao, 1);
      const proximo = Math.round(inicio + (alvo - inicio) * (1 - (1 - progresso) ** 3));
      atual.current = proximo;
      setValor(proximo);
      if (progresso < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [alvo, duracao]);

  return valor;
}
