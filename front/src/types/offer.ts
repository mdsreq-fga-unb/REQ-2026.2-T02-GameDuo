import type { Game } from "@/constants/games";

export type { Game };

export type Modality = "Coaching" | "Duo";

export type AvatarAccent = "pink" | "blue" | "orange" | "purple" | "green" | "yellow";

export type Offer = {
  id: number;
  title: string;
  nickname: string;
  game: Game;
  modality: Modality;
  duration: string;
  price: number;
  avatar: string;
  accent: AvatarAccent;
  level: string;
};
