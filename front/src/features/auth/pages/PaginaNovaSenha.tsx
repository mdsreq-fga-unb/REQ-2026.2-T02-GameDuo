import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout";
import { Button, DialogPanel, Input, Message } from "@/components/ui";
import { useToggle } from "@/hooks/useToggle";
import type { Navigate } from "@/types";
import { AuthHeading } from "../components/AuthHeading";
import { PasswordRulesChecklist } from "../components/PasswordRulesChecklist";
import { isStrongPassword } from "../constants/passwordRules";

export function PaginaNovaSenha({ navigate }: { navigate: Navigate }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [revealPassword, toggleRevealPassword] = useToggle();
  const [revealConfirm, toggleRevealConfirm] = useToggle();
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isStrongPassword(password)) setError("Complete todas as regras da missão.");
    else if (password !== confirm) setError("As senhas não coincidem.");
    else navigate("senha-alterada");
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Definir nova senha" showLogo={false} />
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit}>
          <Input label="Nova senha" value={password} onChange={setPassword} placeholder="Digite sua nova senha" type="password" reveal={revealPassword} onReveal={toggleRevealPassword} />
          <Input label="Confirmar nova senha" value={confirm} onChange={setConfirm} placeholder="Repita sua nova senha" type="password" reveal={revealConfirm} onReveal={toggleRevealConfirm} />
          <PasswordRulesChecklist password={password} />
          <Button type="submit" className="btn--full">Salvar senha</Button>
        </form>
      </DialogPanel>
    </AuthLayout>
  );
}
