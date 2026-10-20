import './PlayerProfileCard.css';
import Avatar from '../avatar/Avatar';
import DialogPanel from '../dialogPanel/DialogPanel';
import PixelIcon from '../pixelIcon/PixelIcon';
import { currentUser } from '../../mocks/user';

function PlayerProfileCard() {
  return (
    <DialogPanel>
      <div className="account-player">
        <Avatar initials={currentUser.initials} size="large" color="blue" />
        <div><h2>{currentUser.name}</h2><p>@{currentUser.handle}</p></div>
      </div>
      <dl className="account-data">
        <div><dt>E-mail</dt><dd>{currentUser.email}</dd></div>
        <div><dt>Telefone</dt><dd>{currentUser.phone}</dd></div>
        <div><dt>Saldo</dt><dd><PixelIcon type="coin" /> {currentUser.credits} créditos</dd></div>
      </dl>
    </DialogPanel>
  );
}

export default PlayerProfileCard;
