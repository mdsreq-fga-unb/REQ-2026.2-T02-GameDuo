import './AuthHeading.css';
import Logo from '../logo/Logo';

function AuthHeading({ title, subtitle, showLogo = true }) {
  return (
    <header className="auth-heading">
      {showLogo && <Logo />}
      <p className="eyebrow">PLAYER SELECT</p>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

export default AuthHeading;
