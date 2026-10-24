import './PixelIcon.css';

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

// type: uma das chaves de "symbols" acima.
function PixelIcon({ type }) {
  return <span className={`pixel-icon pixel-icon--${type}`} aria-hidden="true">{symbols[type]}</span>;
}

export default PixelIcon;
