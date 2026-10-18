const symbols = {
  controller: "◆",
  coin: "●",
  eye: "◉",
  "eye-off": "⊘",
  hourglass: "⌛",
  trophy: "♛",
  people: "♟♟",
  shield: "◆",
  heart: "♥",
};

export type PixelIconType = keyof typeof symbols;

export function PixelIcon({ type }: { type: PixelIconType }) {
  return <span className={`pixel-icon pixel-icon--${type}`} aria-hidden="true">{symbols[type]}</span>;
}
