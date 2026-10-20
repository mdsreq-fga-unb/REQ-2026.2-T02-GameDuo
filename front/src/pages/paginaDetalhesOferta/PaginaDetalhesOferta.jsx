import { Navigate, useNavigate, useParams } from 'react-router-dom';
import './PaginaDetalhesOferta.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Avatar from '../../components/avatar/Avatar';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import PixelIcon from '../../components/pixelIcon/PixelIcon';
import TagRow from '../../components/tagRow/TagRow';
import { offers } from '../../mocks/offers';

// Rota: /oferta/:id — o id da oferta vem da URL.
function PaginaDetalhesOferta({ loggedIn, logout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const offer = offers.find((item) => item.id === Number(id));

  // Oferta inexistente (ex.: /oferta/999): volta para o catálogo.
  if (!offer) return <Navigate to="/" replace />;

  const hire = () => alert("Solicitação enviada! O prestador entrará em contato.");

  return (
    <MainLayout loggedIn={loggedIn} logout={logout}>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/")}>← Voltar às ofertas</Button>
        <div className="detail-grid">
          <DialogPanel>
            <div className="detail-profile">
              <Avatar initials={offer.avatar} size="large" color={offer.accent} />
              <p className="eyebrow">{offer.level}</p>
              <h1>{offer.title}</h1>
              <p>com <strong>@{offer.nickname}</strong></p>
              <TagRow tags={[offer.game, offer.modality]} />
            </div>
          </DialogPanel>
          <DialogPanel>
            <p className="eyebrow">DETALHES DA MISSÃO</p>
            <h2>Prepare sua partida</h2>
            <p className="detail-copy">Uma sessão personalizada para evoluir, completar objetivos e se divertir com companhia de alto nível.</p>
            <ul className="perk-list">
              <li>✓ Comunicação por voz</li>
              <li>✓ Horário combinado</li>
              <li>✓ Sessão de {offer.duration}</li>
            </ul>
            <div className="detail-price">
              <span>Total</span>
              <strong><PixelIcon type="coin" /> {offer.price} créditos</strong>
            </div>
            {loggedIn ? (
              <Button className="btn--full" onClick={hire}>Contratar agora</Button>
            ) : (
              <>
                <Message kind="info">Entre na sua conta para contratar esta oferta.</Message>
                <Button className="btn--full" onClick={() => navigate("/login", { state: { voltarPara: `/oferta/${offer.id}` } })}>Entrar para contratar</Button>
              </>
            )}
          </DialogPanel>
        </div>
      </main>
    </MainLayout>
  );
}

export default PaginaDetalhesOferta;
