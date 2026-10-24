import { useNavigate } from 'react-router-dom';
import './PaginaMinhaConta.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import PlayerProfileCard from '../../components/playerProfileCard/PlayerProfileCard';
import ProviderModeCard from '../../components/providerModeCard/ProviderModeCard';

// Rota: /minha-conta — só acessível logado (o App.jsx redireciona para /login).
function PaginaMinhaConta() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/")}>← Voltar ao catálogo</Button>
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

export default PaginaMinhaConta;
