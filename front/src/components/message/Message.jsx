import './Message.css';

const portraits = {
  success: "✓",
  error: "!",
  info: "i",
};

// kind: "success" | "error" | "info"
function Message({ kind, children }) {
  return (
    <div className={`message message--${kind}`} role={kind === "error" ? "alert" : "status"}>
      <span className="message__portrait">{portraits[kind]}</span>
      <span>{children}</span>
      <i className="message__next">▼</i>
    </div>
  );
}

export default Message;
