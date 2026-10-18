import { Button, Select } from "@/components/ui";
import { gameOptions, priceRangeOptions, type GameFilter, type OfferFilters, type PriceRange } from "../utils/filterOffers";
import { ModalityTabs } from "./ModalityTabs";

type FilterPanelProps = {
  filters: OfferFilters;
  resultCount: number;
  onChange: <K extends keyof OfferFilters>(key: K, value: OfferFilters[K]) => void;
  onApply: () => void;
  onClear: () => void;
};

export function FilterPanel({ filters, resultCount, onChange, onApply, onClear }: FilterPanelProps) {
  return (
    <section className="filter-panel" aria-label="Filtros de ofertas">
      <div className="filter-panel__head">
        <span>BUSCAR PARTIDA</span>
        <small>{resultCount} ofertas encontradas</small>
      </div>
      <div className="filters">
        <ModalityTabs value={filters.modality} onChange={(value) => onChange("modality", value)} />
        <Select label="Jogo" value={filters.game} options={gameOptions} onChange={(value) => onChange("game", value as GameFilter)} />
        <Select label="Preço em créditos" value={filters.price} options={priceRangeOptions} onChange={(value) => onChange("price", value as PriceRange)} />
        <div className="filter-actions">
          <Button onClick={onApply}>Aplicar filtros</Button>
          <Button variant="secondary" onClick={onClear}>Limpar</Button>
        </div>
      </div>
    </section>
  );
}
