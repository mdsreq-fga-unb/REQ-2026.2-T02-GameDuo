import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Button from '../button/Button';
import Logo from '../logo/Logo';
import Avatar from '../avatar/Avatar';
import CoinBalance from '../coinBalance/CoinBalance';
import Modal from '../modal/Modal';
import { useAuth } from '../../context/AuthContext';
import { iniciais } from '../../utils/ofertas';

function Header() {
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();
  const ehAdmin = usuario?.role === "admin";
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const logout = async () => {
    setSaindo(true);
    await sair();
    setSaindo(false);
    setConfirmandoSaida(false);
    navigate("/");
  };

  return (
    <header className="hud">
      <Logo compact />
      <nav aria-label="Navegação principal">
        {usuario ? (
          <>
            <button className="player-chip" onClick={() => navigate("/minha-conta")}>
              <Avatar initials={iniciais(usuario.nickname || usuario.nome)} size="small" />
              <span><b>{ehAdmin ? `${usuario.nickname} (Administrador)` : usuario.nome}</b><small>@{usuario.nickname}{usuario.prestador ? " · prestador" : ""}</small></span>
            </button>
            <CoinBalance />
            {ehAdmin && <Button variant="ghost" onClick={() => navigate("/admin")}>Painel Admin</Button>}
            {usuario.prestador && <Button variant="ghost" onClick={() => navigate("/minhas-ofertas")}>Minhas ofertas</Button>}
            <Button variant="ghost" onClick={() => navigate("/minha-conta")}>Minha conta</Button>
            <Button variant="link" onClick={() => setConfirmandoSaida(true)}>Sair</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate("/login")}>Entrar</Button>
            <Button onClick={() => navigate("/cadastro")}>Criar conta</Button>
          </>
        )}
      </nav>
      <Modal
        aberto={confirmandoSaida}
        titulo="Sair da conta?"
        confirmar="Sair"
        cancelar="Continuar aqui"
        carregando={saindo}
        onConfirmar={logout}
        onCancelar={() => setConfirmandoSaida(false)}
      >
        <p>Você vai precisar entrar de novo para ver suas ofertas e moedas.</p>
      </Modal>
    </header>
  );
}

export default Header;
