import { MainLayout } from "@/components/layout";
import { Button, DialogPanel, Message, PixelIcon } from "@/components/ui";
import { PAGINA_INICIAL, type Navigate, type Offer } from "@/types";

type PaginaDetalhesOfertaProps = {
  offer: Offer;
  loggedIn: boolean;
  navigate: Navigate;
};

export function PaginaDetalhesOferta({ offer, loggedIn, navigate }: PaginaDetalhesOfertaProps) {
  const hire = () => alert("Solicitação enviada! O prestador entrará em contato.");

  return (
    <MainLayout loggedIn={loggedIn} navigate={navigate} logout={() => navigate(PAGINA_INICIAL)}>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate(PAGINA_INICIAL)}>← Voltar às ofertas</Button>
        <div className="detail-grid">
          <DialogPanel>
            <div className="detail-profile">
              <span className={`avatar avatar--large avatar--${offer.accent}`}>{offer.avatar}</span>
              <p className="eyebrow">{offer.level}</p>
              <h1>{offer.title}</h1>
              <p>com <strong>@{offer.nickname}</strong></p>
              <div className="tag-row"><span>{offer.game}</span><span>{offer.modality}</span></div>
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
                <Button className="btn--full" onClick={() => navigate("login")}>Entrar para contratar</Button>
              </>
            )}
          </DialogPanel>
        </div>
      </main>
    </MainLayout>
  );
}
