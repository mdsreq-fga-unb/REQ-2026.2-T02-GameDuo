import { Footer, MainLayout } from "@/components/layout";
import { offers } from "@/mocks/offers";
import type { Navigate, Offer } from "@/types";
import { CatalogHero } from "../components/CatalogHero";
import { FilterPanel } from "../components/FilterPanel";
import { OfferList } from "../components/OfferList";
import { useOfferFilters } from "../hooks/useOfferFilters";

type PaginaInicialProps = {
  loggedIn: boolean;
  navigate: Navigate;
  logout: () => void;
  onSelectOffer: (offer: Offer) => void;
};

export function PaginaInicial({ loggedIn, navigate, logout, onSelectOffer }: PaginaInicialProps) {
  const { draft, updateDraft, apply, clear, filtered } = useOfferFilters(offers);

  return (
    <MainLayout loggedIn={loggedIn} navigate={navigate} logout={logout}>
      <main className="catalog-main">
        <CatalogHero />
        <FilterPanel filters={draft}resultCount={filtered.length} onChange={updateDraft} onApply={apply} onClear={clear} />
        <OfferList offers={filtered} onSelectOffer={onSelectOffer} />
      </main>
      <Footer />
    </MainLayout>
  );
}
