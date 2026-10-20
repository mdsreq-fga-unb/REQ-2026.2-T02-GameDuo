import { useState } from 'react';
import './ProviderModeCard.css';
import Button from '../button/Button';
import DialogPanel from '../dialogPanel/DialogPanel';

function ProviderModeCard() {
  const [provider, setProvider] = useState(true);

  return (
    <DialogPanel>
      <p className="eyebrow">MODO PRESTADOR</p>
      <h2>Ofereça seus serviços</h2>
      <p className="detail-copy">Ative seu perfil para publicar sessões de coaching ou encontrar jogadores como duo.</p>
      <button className={`toggle-card ${provider ? "active" : ""}`} onClick={() => setProvider(!provider)} role="switch" aria-checked={provider}>
        <span>
          <b>Perfil de prestador</b>
          <small>{provider ? "Visível no marketplace" : "Oculto no marketplace"}</small>
        </span>
        <i>{provider ? "ON" : "OFF"}</i>
      </button>
      <Button className="btn--full" disabled={!provider}>Gerenciar minhas ofertas</Button>
    </DialogPanel>
  );
}

export default ProviderModeCard;
