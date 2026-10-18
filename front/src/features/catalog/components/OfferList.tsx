import type { Offer } from "@/types";
import { EmptyState } from "./EmptyState";
import { OfferCard } from "./OfferCard";

type OfferListProps = {
  offers: Offer[];
  onSelectOffer: (offer: Offer) => void;
};

export function OfferList({ offers, onSelectOffer }: OfferListProps) {
  return (
    <section className="offers-section">
      <div className="section-heading">
        <div><p className="eyebrow">PARTY FINDER</p><h2>Ofertas em destaque</h2></div>
        <span className="section-heading__line" />
        <span className="result-count">{offers.length.toString().padStart(2, "0")}</span>
      </div>
      {offers.length ? (
        <div className="offer-grid">
          {offers.map((offer) => <OfferCard key={offer.id} offer={offer} onDetails={() => onSelectOffer(offer)} />)}
        </div>
      ) : <EmptyState />}
    </section>
  );
}
