import { useNavigate } from 'react-router-dom';
import './ProviderModeCard.css';
import Button from '../button/Button';
import DialogPanel from '../dialogPanel/DialogPanel';
import { useAuth } from '../../context/AuthContext';

// Status do modo prestador e atalhos; o formulário fica em /perfil-prestador.
function ProviderModeCard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  return (
    <DialogPanel>
      <p className="eyebrow">MODO PRESTADOR</p>
      <h2>Ofereça seus serviços</h2>
      <p className="detail-copy">Ative seu perfil para publicar sessões de coaching ou encontrar jogadores como duo.</p>
      <div className={`toggle-card ${usuario.prestador ? "active" : ""}`}>
        <span>
          <b>Perfil de prestador</b>
          <small>{usuario.prestador ? "Ativo: você pode publicar ofertas" : "Inativo: preencha o perfil para ativar"}</small>
        </span>
        <i>{usuario.prestador ? "ON" : "OFF"}</i>
      </div>
      {usuario.prestador ? (
        <div className="provider-actions">
          <Button className="btn--full" onClick={() => navigate("/minhas-ofertas")}>Gerenciar minhas ofertas</Button>
          <Button variant="secondary" className="btn--full" onClick={() => navigate("/perfil-prestador")}>Editar perfil e recebimento</Button>
        </div>
      ) : (
        <Button className="btn--full" onClick={() => navigate("/perfil-prestador")}>Ativar perfil de prestador</Button>
      )}
    </DialogPanel>
  );
}

export default ProviderModeCard;
