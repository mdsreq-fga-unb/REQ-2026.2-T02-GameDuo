import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import './PaginaPerfilPrestador.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Avatar from '../../components/avatar/Avatar';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import OfferCard from '../../components/offerCard/OfferCard';
import TagRow from '../../components/tagRow/TagRow';
import { api } from '../../services/api';
import { iniciais, paraCard } from '../../utils/ofertas';

function Etiquetas({ titulo, tags }) {
  if (tags.length === 0) return null;
  return <><h3>{titulo}</h3><TagRow tags={tags} /></>;
}

// Rota: /prestador/:codigo — RF07, pública.
function PaginaPerfilPrestador() {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const [prestador, setPrestador] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/prestadores/${codigo}`).then((data) => setPrestador(data.prestador)).catch(setError);
  }, [codigo]);

  if (error?.status === 404) return <Navigate to="/" replace />;

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/")}>← Voltar ao catálogo</Button>
        {error && <Message kind="error">{error.message}</Message>}
        {!prestador && !error && <Message kind="info">Carregando perfil...</Message>}
        {prestador && (
          <>
            <div className="provider-profile">
              <DialogPanel size="wide">
                <div className="account-player">
                  <Avatar initials={iniciais(prestador.nickname ?? "")} size="large" color="blue" />
                  <div><p className="eyebrow">PRESTADOR</p><h1>@{prestador.nickname}</h1></div>
                </div>
                <h3>Apresentação</h3>
                <p className="detail-copy">{prestador.apresentacao || "Este prestador ainda não escreveu uma apresentação."}</p>
                {prestador.jogos.length > 0 && (
                  <>
                    <h3>Jogos e nível declarado</h3>
                    <ul>{prestador.jogos.map((item) => <li key={item.jogo}><b>{item.jogo}</b>: {item.nivel}</li>)}</ul>
                  </>
                )}
                <Etiquetas titulo="Modalidades" tags={prestador.modalidades} />
                <Etiquetas titulo="Formatos" tags={prestador.formatos} />
                <Etiquetas titulo="Idiomas" tags={prestador.idiomas} />
                <h3>Sobre o nível</h3>
                <p className="detail-copy">O nível é declarado pelo próprio prestador e não é verificado pelo GameDuo.</p>
              </DialogPanel>
            </div>
            <h2>Ofertas ativas</h2>
            {prestador.ofertas.length === 0
              ? <p className="detail-copy">Nenhuma oferta no momento.</p>
              : <div className="provider-offers">{prestador.ofertas.map((oferta) => <OfferCard key={oferta.id} offer={paraCard(oferta)} />)}</div>}
          </>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaPerfilPrestador;
