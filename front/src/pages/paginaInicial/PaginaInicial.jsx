import { useEffect, useState } from 'react';
import './PaginaInicial.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Footer from '../../components/footer/Footer';
import CatalogHero from '../../components/catalogHero/CatalogHero';
import FilterPanel from '../../components/filterPanel/FilterPanel';
import OfferList from '../../components/offerList/OfferList';
import Message from '../../components/message/Message';
import { api } from '../../services/api';
import { paraCard } from '../../utils/ofertas';
import { defaultFilters, filterOffers } from '../../utils/filterOffers';

// Página principal: catálogo de ofertas com filtros.
function PaginaInicial() {
  // draft = o que está marcado no painel; applied = o que está filtrando a lista.
  // A lista só muda quando o usuário clica em "Aplicar filtros".
  const [draft, setDraft] = useState(defaultFilters);
  const [applied, setApplied] = useState(defaultFilters);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/ofertas")
      .then((data) => setOffers(data.ofertas.map(paraCard)))
      .catch((err) => setError(err.message));
  }, []);

  const filtered = filterOffers(offers, applied);

  const updateDraft = (key, value) => setDraft({ ...draft, [key]: value });

  const clear = () => {
    setDraft(defaultFilters);
    setApplied(defaultFilters);
  };

  return (
    <MainLayout>
      <main className="catalog-main">
        <CatalogHero />
        <FilterPanel filters={draft} resultCount={filtered.length} onChange={updateDraft} onApply={() => setApplied(draft)} onClear={clear} />
        {error && <Message kind="error">{error}</Message>}
        <OfferList offers={filtered} />
      </main>
      <Footer />
    </MainLayout>
  );
}

export default PaginaInicial;
