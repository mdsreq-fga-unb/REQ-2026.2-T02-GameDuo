import './EmptyState.css';

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true"><span>?</span><b>⌕</b></div>
      <h3>Nenhuma oferta encontrada</h3>
      <p>Nenhuma oferta encontrada para os filtros selecionados.</p>
    </div>
  );
}

export default EmptyState;
