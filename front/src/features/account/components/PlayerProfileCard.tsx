import { DialogPanel, PixelIcon } from "@/components/ui";
import { currentUser } from "@/mocks/user";

export function PlayerProfileCard() {
  return (
    <DialogPanel>
      <div className="account-player">
        <span className="avatar avatar--large avatar--blue">{currentUser.initials}</span>
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
