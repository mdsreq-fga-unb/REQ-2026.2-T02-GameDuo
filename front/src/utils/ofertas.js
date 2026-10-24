// Converte a oferta que vem da API para o formato usado pelos cartões e filtros.
const accents = ["pink", "blue", "orange", "purple", "green", "yellow"];

export function iniciais(texto = "") {
  const limpo = texto.replace(/[^\p{L}\p{N} ]/gu, "").trim();
  const partes = limpo.split(/\s+/).filter(Boolean);
  if (partes.length > 1) return (partes[0][0] + partes[1][0]).toUpperCase();
  return limpo.slice(0, 2).toUpperCase() || "??";
}

export function paraCard(oferta) {
  const nickname = oferta.prestador?.nickname || oferta.prestador?.nome || "prestador";
  return {
    id: oferta.id,
    title: oferta.titulo,
    description: oferta.descricao,
    nickname,
    game: oferta.jogo,
    modality: oferta.modalidade,
    duration: `${oferta.duracao} min`,
    price: oferta.preco,
    avatar: iniciais(nickname),
    accent: accents[oferta.id % accents.length],
    level: oferta.nivel || oferta.modalidade,
  };
}
