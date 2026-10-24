export const ALL = "Todos";

// Jogos suportados pela plataforma.
export const gameOptions = [ALL, "Counter-Strike 2", "League of Legends"];

// Cada faixa de preço é uma função que diz se o preço entra nela.
const priceRanges = {
  [ALL]: () => true,
  "Até 75": (price) => price <= 75,
  "76 a 100": (price) => price >= 76 && price <= 100,
  "Acima de 100": (price) => price > 100,
};

export const priceRangeOptions = Object.keys(priceRanges);

// modality vazio = qualquer modalidade.
export const defaultFilters = { modality: "", game: ALL, price: ALL };

export function filterOffers(offers, filters) {
  return offers.filter((offer) => {
    const modalityMatch = !filters.modality || offer.modality === filters.modality;
    const gameMatch = filters.game === ALL || offer.game === filters.game;
    const priceMatch = priceRanges[filters.price](offer.price);
    return modalityMatch && gameMatch && priceMatch;
  });
}
