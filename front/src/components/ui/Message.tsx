import type { ReactNode } from "react";
import type { MessageKind } from "@/types";

const portraits: Record<MessageKind, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

export function Message({ kind, children }: { kind: MessageKind; children: ReactNode }) {
  return (
    <div className={`message message--${kind}`} role={kind === "error" ? "alert" : "status"}>
      <span className="message__portrait">{portraits[kind]}</span>
      <span>{children}</span>
      <i className="message__next">▼</i>
    </div>
  );
}
