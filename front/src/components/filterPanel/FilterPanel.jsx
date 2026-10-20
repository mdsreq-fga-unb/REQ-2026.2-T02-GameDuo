import './FilterPanel.css';
import Button from '../button/Button';
import Select from '../select/Select';
import ModalityTabs from '../modalityTabs/ModalityTabs';
import { gameOptions, priceRangeOptions } from '../../utils/filterOffers';

// onChange(chave, valor): chave é "modality", "game" ou "price".
function FilterPanel({ filters, resultCount, onChange, onApply, onClear }) {
  return (
    <section className="filter-panel" aria-label="Filtros de ofertas">
      <div className="filter-panel__head">
        <span>BUSCAR PARTIDA</span>
        <small>{resultCount} ofertas encontradas</small>
      </div>
      <div className="filters">
        <ModalityTabs value={filters.modality} onChange={(value) => onChange("modality", value)} />
        <Select label="Jogo" value={filters.game} options={gameOptions} onChange={(value) => onChange("game", value)} />
        <Select label="Preço em créditos" value={filters.price} options={priceRangeOptions} onChange={(value) => onChange("price", value)} />
        <div className="filter-actions">
          <Button onClick={onApply}>Aplicar filtros</Button>
          <Button variant="secondary" onClick={onClear}>Limpar</Button>
        </div>
      </div>
    </section>
  );
}

export default FilterPanel;
