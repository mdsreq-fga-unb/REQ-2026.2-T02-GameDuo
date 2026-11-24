import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import './PaginaDetalhesOferta.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Avatar from '../../components/avatar/Avatar';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import HireCard from '../../components/hireCard/HireCard';
import PixelIcon from '../../components/pixelIcon/PixelIcon';
import TagRow from '../../components/tagRow/TagRow';
import { api } from '../../services/api';
import { paraCard } from '../../utils/ofertas';

// Rota: /oferta/:id — o id da oferta vem da URL.
function PaginaDetalhesOferta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/ofertas/${id}`)
      .then((data) => setOffer(paraCard(data.oferta)))
      .catch((err) => setError(err));
  }, [id]);

  // Oferta inexistente (ex.: /oferta/999): volta para o catálogo.
  if (error?.status === 404) return <Navigate to="/" replace />;


  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/")}>← Voltar às ofertas</Button>
        {error && <Message kind="error">{error.message}</Message>}
        {offer && (
          <div className="detail-grid">
            <DialogPanel>
              <div className="detail-profile">
                <Avatar initials={offer.avatar} size="large" color={offer.accent} />
                <p className="eyebrow">{offer.level}</p>
                <h1>{offer.title}</h1>
                <p>com <strong>@{offer.nickname}</strong></p>
                {offer.providerCode && <Button variant="link" onClick={() => navigate(`/prestador/${offer.providerCode}`)}>Ver perfil</Button>}
                <TagRow tags={[offer.game, offer.modality]} />
              </div>
            </DialogPanel>
            <DialogPanel>
              <p className="eyebrow">DETALHES DA MISSÃO</p>
              <h2>Prepare sua partida</h2>
              <p className="detail-copy">{offer.description || "Uma sessão personalizada para evoluir, completar objetivos e se divertir com companhia de alto nível."}</p>
              <ul className="perk-list">
                <li>✓ Comunicação: {offer.communication ?? "a combinar"}</li>
                <li>✓ Horário escolhido por você</li>
                <li>✓ Sessão de {offer.duration}</li>
              </ul>
              {offer.conditions && <p className="detail-copy"><b>Condições:</b> {offer.conditions}</p>}
              <div className="detail-price">
                <span>Total</span>
                <strong><PixelIcon type="coin" /> {offer.price} créditos</strong>
              </div>
              <HireCard offer={offer} />
            </DialogPanel>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaDetalhesOferta;
