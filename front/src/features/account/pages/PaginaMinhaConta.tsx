import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import { PAGINA_INICIAL, type Navigate } from "@/types";
import { PlayerProfileCard } from "../components/PlayerProfileCard";
import { ProviderModeCard } from "../components/ProviderModeCard";

export function PaginaMinhaConta({ navigate, logout }: { navigate: Navigate; logout: () => void }) {
  return (
    <MainLayout loggedIn navigate={navigate} logout={logout}>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate(PAGINA_INICIAL)}>← Voltar ao catálogo</Button>
        <div className="account-title">
          <p className="eyebrow">PLAYER PROFILE</p>
          <h1>Minha conta</h1>
        </div>
        <div className="detail-grid">
          <PlayerProfileCard />
          <ProviderModeCard />
        </div>
      </main>
    </MainLayout>
  );
}
