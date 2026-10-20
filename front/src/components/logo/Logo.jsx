import { useNavigate } from 'react-router-dom';
import './Logo.css';

// compact = versão menor, usada no Header e no Footer.
// Clicar no logo leva ao catálogo (ou sobe a página, se já estiver nele).
function Logo({ compact = false }) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className={`logo ${compact ? "logo--compact" : ""}`} onClick={goHome} aria-label="GameDuo, início">
      <span className="logo-mark"><i /><i /></span>
      <span>Game<span>Duo</span></span>
    </button>
  );
}

export default Logo;
