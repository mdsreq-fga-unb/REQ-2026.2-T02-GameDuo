import type { ReactNode } from "react";

export function DialogPanel({ children, size = "normal" }: { children: ReactNode; size?: "normal" | "wide" }) {
  return <section className={`dialog-panel dialog-panel--${size}`}>{children}</section>;
}
