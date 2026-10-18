// Jogos suportados pela plataforma.
export const GAMES = ["Counter-Strike 2", "League of Legends"] as const;

export type Game = (typeof GAMES)[number];
