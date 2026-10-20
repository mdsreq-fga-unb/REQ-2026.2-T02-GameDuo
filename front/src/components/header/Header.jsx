import { useNavigate } from 'react-router-dom';
import './Header.css';
import Button from '../button/Button';
import Logo from '../logo/Logo';
import Avatar from '../avatar/Avatar';
import PixelIcon from '../pixelIcon/PixelIcon';
import { currentUser } from '../../mocks/user';

function Header({ loggedIn, logout }) {
  const navigate = useNavigate();

  const sair = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="hud">
      <Logo compact />
      <nav aria-label="Navegação principal">
        {loggedIn ? (
          <>
            <button className="player-chip" onClick={() => navigate("/minha-conta")}>
              <Avatar initials={currentUser.initials} size="small" />
              <span><b>{currentUser.name}</b><small><PixelIcon type="coin" /> {currentUser.credits} créditos</small></span>
            </button>
            <Button variant="ghost" onClick={() => navigate("/minha-conta")}>Minha conta</Button>
            <Button variant="link" onClick={sair}>Sair</Button>
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
