import { useState } from 'react';
import './PaginaInicial.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Footer from '../../components/footer/Footer';
import CatalogHero from '../../components/catalogHero/CatalogHero';
import FilterPanel from '../../components/filterPanel/FilterPanel';
import OfferList from '../../components/offerList/OfferList';
import { offers } from '../../mocks/offers';
import { defaultFilters, filterOffers } from '../../utils/filterOffers';

// Página principal: catálogo de ofertas com filtros.
function PaginaInicial({ loggedIn, logout }) {
  // draft = o que está marcado no painel; applied = o que está filtrando a lista.
  // A lista só muda quando o usuário clica em "Aplicar filtros".
  const [draft, setDraft] = useState(defaultFilters);
  const [applied, setApplied] = useState(defaultFilters);

  const filtered = filterOffers(offers, applied);

  const updateDraft = (key, value) => setDraft({ ...draft, [key]: value });

  const clear = () => {
    setDraft(defaultFilters);
    setApplied(defaultFilters);
  };

  return (
    <MainLayout loggedIn={loggedIn} logout={logout}>
      <main className="catalog-main">
        <CatalogHero />
        <FilterPanel filters={draft} resultCount={filtered.length} onChange={updateDraft} onApply={() => setApplied(draft)} onClear={clear} />
        <OfferList offers={filtered} />
      </main>
      <Footer />
    </MainLayout>
  );
}

export default PaginaInicial;
