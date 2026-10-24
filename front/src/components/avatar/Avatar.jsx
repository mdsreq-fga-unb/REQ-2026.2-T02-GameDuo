import './Avatar.css';

// size: "small" | "large" (vazio = médio)
// color: "pink" | "blue" | "orange" | "purple" | "green" | "yellow" (vazio = azul)
function Avatar({ initials, size, color }) {
  const classes = ["avatar"];
  if (size) classes.push(`avatar--${size}`);
  if (color) classes.push(`avatar--${color}`);

  return <span className={classes.join(" ")}>{initials}</span>;
}

export default Avatar;
