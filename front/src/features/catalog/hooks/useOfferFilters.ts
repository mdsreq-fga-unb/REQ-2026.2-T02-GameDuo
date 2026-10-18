import { useMemo, useState } from "react";
import type { Offer } from "@/types";
import { defaultFilters, filterOffers, type OfferFilters } from "../utils/filterOffers";

/**
 * Mantém dois estados: o rascunho editado no painel (`draft`) e os filtros
 * efetivamente aplicados à lista, que só mudam ao clicar em "Aplicar filtros".
 */
export function useOfferFilters(offers: Offer[]) {
  const [draft, setDraft] = useState<OfferFilters>(defaultFilters);
  const [applied, setApplied] = useState<OfferFilters>(defaultFilters);

  const filtered = useMemo(() => filterOffers(offers, applied), [offers, applied]);

  const updateDraft = <K extends keyof OfferFilters>(key: K, value: OfferFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const apply = () => setApplied(draft);

  const clear = () => {
    setDraft(defaultFilters);
    setApplied(defaultFilters);
  };

  return { draft, updateDraft, apply, clear, filtered };
}
