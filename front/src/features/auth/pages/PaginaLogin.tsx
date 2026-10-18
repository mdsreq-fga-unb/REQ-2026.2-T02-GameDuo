import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout";
import { Button, DialogPanel, Input, Message } from "@/components/ui";
import { useToggle } from "@/hooks/useToggle";
import { demoCredentials } from "@/mocks/user";
import { PAGINA_INICIAL, type Navigate } from "@/types";
import { AuthHeading } from "../components/AuthHeading";

type PaginaLoginProps = {
  navigate: Navigate;
  onLogin: () => void;
  /** Mensagem exibida ao chegar de outro fluxo (ex.: cadastro concluído). */
  success: string;
};

export function PaginaLogin({ navigate, onLogin, success }: PaginaLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, toggleReveal] = useToggle();
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (email === demoCredentials.email && password === demoCredentials.password) onLogin();
    else setError("E-mail ou senha incorretos. Confira os dados e tente novamente.");
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Entre na sua conta" subtitle="Encontre sua próxima dupla." />
        {success && <Message kind="success">{success}</Message>}
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit}>
          <Input label="E-mail" value={email} onChange={setEmail} placeholder="Digite seu e-mail" type="email" autoComplete="email" />
          <Input label="Senha" value={password} onChange={setPassword} placeholder="Digite sua senha" type="password" reveal={reveal} onReveal={toggleReveal} autoComplete="current-password" />
          <p className="demo-hint">ACESSO DEMO: {demoCredentials.email} / {demoCredentials.password}</p>
          <Button type="submit" className="btn--full">Entrar</Button>
        </form>
        <div className="auth-links">
          <p>Não tem uma conta? <Button variant="link" onClick={() => navigate("cadastro")}>Criar conta</Button></p>
          <p>Esqueceu sua senha? <Button variant="link" onClick={() => navigate("recuperar-senha")}>Recuperar senha</Button></p>
        </div>
      </DialogPanel>
      <Button variant="ghost" className="back-floating" onClick={() => navigate(PAGINA_INICIAL)}>← Voltar ao catálogo</Button>
    </AuthLayout>
  );
}
