import type { ReactNode } from "react";

/** Cenário centralizado usado pelas telas de login, cadastro e recuperação. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout scene">
      <div className="stars stars--one" />
      <div className="stars stars--two" />
      {children}
    </main>
  );
}
