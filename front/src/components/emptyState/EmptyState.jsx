import './EmptyState.css';

// Sem props, mostra o aviso do catálogo de ofertas; outras telas podem trocar os textos.
function EmptyState({ title = "Nenhuma oferta encontrada", text = "Nenhuma oferta encontrada para os filtros selecionados." }) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true"><span>?</span><b>⌕</b></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default EmptyState;
