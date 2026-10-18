import { GAMES } from "@/constants/games";
import type { Game, Modality, Offer } from "@/types";

export const ALL = "Todos";

export type GameFilter = Game | typeof ALL;

export const gameOptions: GameFilter[] = [ALL, ...GAMES];

export const priceRanges = {
  [ALL]: () => true,
  "Até 75": (price: number) => price <= 75,
  "76 a 100": (price: number) => price >= 76 && price <= 100,
  "Acima de 100": (price: number) => price > 100,
} satisfies Record<string, (price: number) => boolean>;

export type PriceRange = keyof typeof priceRanges;

export const priceRangeOptions = Object.keys(priceRanges) as PriceRange[];

export type OfferFilters = {
  modality: Modality | "";
  game: GameFilter;
  price: PriceRange;
};

export const defaultFilters: OfferFilters = { modality: "", game: ALL, price: ALL };

export function filterOffers(offers: Offer[], filters: OfferFilters) {
  return offers.filter((offer) => {
    const modalityMatch = !filters.modality || offer.modality === filters.modality;
    const gameMatch = filters.game === ALL || offer.game === filters.game;
    const priceMatch = priceRanges[filters.price](offer.price);
    return modalityMatch && gameMatch && priceMatch;
  });
}
