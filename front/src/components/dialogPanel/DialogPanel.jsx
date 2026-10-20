import './DialogPanel.css';

// size: "normal" | "wide"
function DialogPanel({ children, size = "normal" }) {
  return <section className={`dialog-panel dialog-panel--${size}`}>{children}</section>;
}

export default DialogPanel;
