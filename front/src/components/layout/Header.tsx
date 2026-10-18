import { Button, Logo, PixelIcon } from "@/components/ui";
import { currentUser } from "@/mocks/user";
import type { Navigate } from "@/types";

type HeaderProps = {
  loggedIn: boolean;
  navigate: Navigate;
  logout: () => void;
};

export function Header({ loggedIn, navigate, logout }: HeaderProps) {
  return (
    <header className="hud">
      <Logo compact />
      <nav aria-label="Navegação principal">
        {loggedIn ? (
          <>
            <button className="player-chip" onClick={() => navigate("minha-conta")}>
              <span className="avatar avatar--small">{currentUser.initials}</span>
              <span><b>{currentUser.name}</b><small><PixelIcon type="coin" /> {currentUser.credits} créditos</small></span>
            </button>
            <Button variant="ghost" onClick={() => navigate("minha-conta")}>Minha conta</Button>
            <Button variant="link" onClick={logout}>Sair</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate("login")}>Entrar</Button>
            <Button onClick={() => navigate("cadastro")}>Criar conta</Button>
          </>
        )}
      </nav>
    </header>
  );
}
