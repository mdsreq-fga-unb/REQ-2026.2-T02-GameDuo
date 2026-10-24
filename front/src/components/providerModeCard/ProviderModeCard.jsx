import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderModeCard.css';
import Button from '../button/Button';
import DialogPanel from '../dialogPanel/DialogPanel';
import Input from '../input/Input';
import Message from '../message/Message';
import { useAuth } from '../../context/AuthContext';
import { api, errosPorCampo } from '../../services/api';

// Quem ainda não é prestador vê o formulário de ativação;
// quem já é vê o status e o atalho para as próprias ofertas.
function ProviderModeCard() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();
  const [apresentacao, setApresentacao] = useState("");
  const [pix, setPix] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const ativar = async (event) => {
    event.preventDefault();
    if (!pix.trim()) {
      setErrors({ dados: "Informe sua chave Pix para recebimento." });
      return;
    }

    setErrors({});
    setError("");
    setEnviando(true);
    try {
      const data = await api("/prestador", { method: "POST", body: { apresentacao: apresentacao.trim() || null, dados: pix.trim() } });
      setUsuario(data.usuario);
    } catch (err) {
      setErrors(errosPorCampo(err));
      if (!err.errors) setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <DialogPanel>
      <p className="eyebrow">MODO PRESTADOR</p>
      <h2>Ofereça seus serviços</h2>
      <p className="detail-copy">Ative seu perfil para publicar sessões de coaching ou encontrar jogadores como duo.</p>
      <div className={`toggle-card ${usuario.prestador ? "active" : ""}`}>
        <span>
          <b>Perfil de prestador</b>
          <small>{usuario.prestador ? "Ativo: você pode publicar ofertas" : "Inativo: preencha os dados abaixo para ativar"}</small>
        </span>
        <i>{usuario.prestador ? "ON" : "OFF"}</i>
      </div>
      {usuario.prestador ? (
        <Button className="btn--full" onClick={() => navigate("/minhas-ofertas")}>Gerenciar minhas ofertas</Button>
      ) : (
        <form onSubmit={ativar}>
          {error && <Message kind="error">{error}</Message>}
          <Input label="Apresentação (opcional)" value={apresentacao} onChange={setApresentacao} placeholder="Ex.: Coach de CS2, Faceit nível 10" error={errors.apresentacao} />
          <Input label="Chave Pix" value={pix} onChange={setPix} placeholder="Para receber pelos atendimentos" help="Usada apenas para seus recebimentos." error={errors.dados} />
          <Button type="submit" className="btn--full" disabled={enviando}>{enviando ? "Ativando..." : "Ativar perfil de prestador"}</Button>
        </form>
      )}
    </DialogPanel>
  );
}

export default ProviderModeCard;
