import './OfferList.css';
import OfferCard from '../offerCard/OfferCard';
import EmptyState from '../emptyState/EmptyState';

function OfferList({ offers }) {
  return (
    <section className="offers-section">
      <div className="section-heading">
        <div><p className="eyebrow">PARTY FINDER</p><h2>Ofertas em destaque</h2></div>
        <span className="section-heading__line" />
        <span className="result-count">{offers.length.toString().padStart(2, "0")}</span>
      </div>
      {offers.length ? (
        <div className="offer-grid">
          {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
        </div>
      ) : <EmptyState />}
    </section>
  );
}

export default OfferList;
