import { useNavigate } from 'react-router-dom';
import './Header.css';
import Button from '../button/Button';
import Logo from '../logo/Logo';
import Avatar from '../avatar/Avatar';
import { useAuth } from '../../context/AuthContext';
import { iniciais } from '../../utils/ofertas';

function Header() {
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();

  const logout = async () => {
    await sair();
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
              <span><b>{usuario.nome}</b><small>@{usuario.nickname}{usuario.prestador ? " · prestador" : ""}</small></span>
            </button>
            {usuario.prestador && <Button variant="ghost" onClick={() => navigate("/minhas-ofertas")}>Minhas ofertas</Button>}
            <Button variant="ghost" onClick={() => navigate("/minha-conta")}>Minha conta</Button>
            <Button variant="link" onClick={logout}>Sair</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate("/login")}>Entrar</Button>
            <Button onClick={() => navigate("/cadastro")}>Criar conta</Button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
