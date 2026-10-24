import { useNavigate } from 'react-router-dom';
import './OfferCard.css';
import Avatar from '../avatar/Avatar';
import Button from '../button/Button';
import PixelIcon from '../pixelIcon/PixelIcon';
import TagRow from '../tagRow/TagRow';

function OfferCard({ offer }) {
  const navigate = useNavigate();

  return (
    <article className="offer-card">
      <div className="offer-card__top">
        <Avatar initials={offer.avatar} color={offer.accent} />
        <div>
          <p className="offer-card__level">{offer.level}</p>
          <p className="offer-card__nick">@{offer.nickname}</p>
        </div>
        <span className="online-dot">ON</span>
      </div>
      <h3>{offer.title}</h3>
      <TagRow tags={[offer.game, offer.modality]} />
      <div className="offer-card__meta">
        <span>{offer.duration}</span>
        <strong><PixelIcon type="coin" /> {offer.price}</strong>
      </div>
      <Button onClick={() => navigate(`/oferta/${offer.id}`)}>Ver detalhes <span aria-hidden="true">►</span></Button>
    </article>
  );
}

export default OfferCard;
