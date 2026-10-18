import type { ReactNode } from "react";
import type { Navigate } from "@/types";
import { Header } from "./Header";

type MainLayoutProps = {
  loggedIn: boolean;
  navigate: Navigate;
  logout: () => void;
  children: ReactNode;
};

/** Cenário padrão das telas do marketplace: HUD no topo + conteúdo. */
export function MainLayout({ loggedIn, navigate, logout, children }: MainLayoutProps) {
  return (
    <div className="catalog-page scene">
      <Header loggedIn={loggedIn} navigate={navigate} logout={logout} />
      {children}
    </div>
  );
}
