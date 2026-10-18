import { Button, PixelIcon } from "@/components/ui";
import type { Offer } from "@/types";

export function OfferCard({ offer, onDetails }: { offer: Offer; onDetails: () => void }) {
  return (
    <article className="offer-card">
      <div className="offer-card__top">
        <span className={`avatar avatar--${offer.accent}`}>{offer.avatar}</span>
        <div>
          <p className="offer-card__level">{offer.level}</p>
          <p className="offer-card__nick">@{offer.nickname}</p>
        </div>
        <span className="online-dot">ON</span>
      </div>
      <h3>{offer.title}</h3>
      <div className="tag-row"><span>{offer.game}</span><span>{offer.modality}</span></div>
      <div className="offer-card__meta">
        <span>{offer.duration}</span>
        <strong><PixelIcon type="coin" /> {offer.price}</strong>
      </div>
      <Button onClick={onDetails}>Ver detalhes <span aria-hidden="true">►</span></Button>
    </article>
  );
}
