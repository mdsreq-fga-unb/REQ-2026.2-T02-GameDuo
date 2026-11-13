import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoinBalance.css';
import PixelIcon from '../pixelIcon/PixelIcon';
import { api } from '../../services/api';
import { EVENTO_CARTEIRA, formatarMoedas } from '../../utils/moedas';

function CoinBalance() {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(null);
  const [falhou, setFalhou] = useState(false);
  const [pulso, setPulso] = useState(0);
  const anterior = useRef(null);

  useEffect(() => {
    let ativo = true;
    const carregar = () =>
      api("/carteira")
        .then((data) => {
          if (!ativo) return;
          if (anterior.current !== null && anterior.current !== data.saldo) setPulso((valor) => valor + 1);
          anterior.current = data.saldo;
          setSaldo(data.saldo);
        })
        .catch(() => ativo && setFalhou(true));

    carregar();
    window.addEventListener(EVENTO_CARTEIRA, carregar);
    return () => {
      ativo = false;
      window.removeEventListener(EVENTO_CARTEIRA, carregar);
    };
  }, []);

  if (falhou) return null;

  return (
    <button type="button" key={pulso} className={`coin-balance ${pulso ? "is-updated" : ""}`} onClick={() => navigate("/carteira")} aria-label={saldo === null ? "Abrir carteira" : `Carteira: ${saldo} moedas`}>
      <PixelIcon type="coin" />
      <span>{saldo === null ? "···" : formatarMoedas(saldo)}</span>
      <small>moedas</small>
    </button>
  );
}

export default CoinBalance;
