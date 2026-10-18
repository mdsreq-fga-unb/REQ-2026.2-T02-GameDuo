import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout";
import { Button, DialogPanel, Input } from "@/components/ui";
import { useToggle } from "@/hooks/useToggle";
import type { Navigate } from "@/types";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { AuthHeading } from "../components/AuthHeading";

type RegisterForm = {
  nickname: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const emptyForm: RegisterForm = { nickname: "", email: "", phone: "", password: "", confirm: "" };

function validate(data: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {};
  if (data.nickname.trim().length < 3) errors.nickname = "Use pelo menos 3 caracteres.";
  if (!isValidEmail(data.email)) errors.email = "Informe um e-mail válido.";
  if (!isValidPhone(data.phone)) errors.phone = "Informe telefone e DDD.";
  if (data.password.length < 8) errors.password = "A senha precisa ter 8 caracteres.";
  if (data.confirm !== data.password) errors.confirm = "As senhas não coincidem.";
  return errors;
}

export function PaginaCadastro({ navigate, onSuccess }: { navigate: Navigate; onSuccess: () => void }) {
  const [data, setData] = useState<RegisterForm>(emptyForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [revealPassword, toggleRevealPassword] = useToggle();
  const [revealConfirm, toggleRevealConfirm] = useToggle();

  const update = (key: keyof RegisterForm) => (value: string) => setData({ ...data, [key]: value });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSuccess();
  };

  return (
    <AuthLayout>
      <DialogPanel size="wide">
        <AuthHeading title="Criar conta" subtitle="Encontre coaching e duo ou ofereça seus serviços." />
        <form onSubmit={submit} className="form-grid">
          <div className="form-grid__full">
            <Input label="Nickname" value={data.nickname} onChange={update("nickname")} placeholder="Nickname/Apelido" help="Este será seu nome público no GameDuo." error={errors.nickname} />
          </div>
          <Input label="E-mail" value={data.email} onChange={update("email")} placeholder="Digite seu e-mail" type="email" error={errors.email} />
          <Input label="Telefone" value={data.phone} onChange={update("phone")} placeholder="Informe seu telefone com DDD" type="tel" error={errors.phone} />
          <Input label="Senha" value={data.password} onChange={update("password")} placeholder="Crie sua senha" type="password" reveal={revealPassword} onReveal={toggleRevealPassword} error={errors.password} />
          <Input label="Confirmar senha" value={data.confirm} onChange={update("confirm")} placeholder="Repita sua senha" type="password" reveal={revealConfirm} onReveal={toggleRevealConfirm} error={errors.confirm} />
          <div className="form-grid__full"><Button type="submit" className="btn--full">Criar conta</Button></div>
        </form>
        <div className="auth-links">
          <p>Já tem uma conta? <Button variant="link" onClick={() => navigate("login")}>Entrar</Button></p>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}
