import './PlayerProfileCard.css';
import Avatar from '../avatar/Avatar';
import DialogPanel from '../dialogPanel/DialogPanel';
import { useAuth } from '../../context/AuthContext';
import { iniciais } from '../../utils/ofertas';

function PlayerProfileCard() {
  const { usuario } = useAuth();

  return (
    <DialogPanel>
      <div className="account-player">
        <Avatar initials={iniciais(usuario.nickname || usuario.nome)} size="large" color="blue" />
        <div><h2>{usuario.nome}</h2><p>@{usuario.nickname}</p></div>
      </div>
      <dl className="account-data">
        <div><dt>E-mail</dt><dd>{usuario.email}</dd></div>
        <div><dt>Perfil</dt><dd>{usuario.prestador ? "Jogador e prestador" : "Jogador"}</dd></div>
      </dl>
    </DialogPanel>
  );
}

export default PlayerProfileCard;
