import { Button, DialogPanel } from "@/components/ui";
import { useToggle } from "@/hooks/useToggle";

export function ProviderModeCard() {
  const [provider, toggleProvider] = useToggle(true);

  return (
    <DialogPanel>
      <p className="eyebrow">MODO PRESTADOR</p>
      <h2>Ofereça seus serviços</h2>
      <p className="detail-copy">Ative seu perfil para publicar sessões de coaching ou encontrar jogadores como duo.</p>
      <button className={`toggle-card ${provider ? "active" : ""}`} onClick={toggleProvider} role="switch" aria-checked={provider}>
        <span>
          <b>Perfil de prestador</b>
          <small>{provider ? "Visível no marketplace" : "Oculto no marketplace"}</small>
        </span>
        <i>{provider ? "ON" : "OFF"}</i>
      </button>
      <Button className="btn--full" disabled={!provider}>Gerenciar minhas ofertas</Button>
    </DialogPanel>
  );
}
