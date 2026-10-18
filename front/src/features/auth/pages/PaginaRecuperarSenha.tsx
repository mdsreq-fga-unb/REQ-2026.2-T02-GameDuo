import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout";
import { Button, DialogPanel, Input } from "@/components/ui";
import type { Navigate } from "@/types";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { AuthHeading } from "../components/AuthHeading";
import { RecoveryChannelPicker, type RecoveryChannel } from "../components/RecoveryChannelPicker";

const channelConfig = {
  email: { label: "E-mail cadastrado", placeholder: "Digite seu e-mail", type: "email", error: "Informe um e-mail válido.", isValid: isValidEmail },
  phone: { label: "Telefone cadastrado", placeholder: "Informe seu telefone com DDD", type: "tel", error: "Informe telefone e DDD.", isValid: isValidPhone },
} satisfies Record<RecoveryChannel, unknown>;

export function PaginaRecuperarSenha({ navigate }: { navigate: Navigate }) {
  const [channel, setChannel] = useState<RecoveryChannel>("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const config = channelConfig[channel];

  const changeChannel = (next: RecoveryChannel) => {
    setChannel(next);
    setValue("");
    setError("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (config.isValid(value)) navigate("validar-codigo");
    else setError(config.error);
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Recuperar senha" />
        <p className="intro-copy">Escolha como deseja receber o código.</p>
        <RecoveryChannelPicker value={channel} onChange={changeChannel} />
        <form onSubmit={submit}>
          <Input label={config.label} value={value} onChange={setValue} placeholder={config.placeholder} type={config.type} error={error} />
          <Button type="submit" className="btn--full">Enviar código</Button>
        </form>
        <div className="auth-links">
          <Button variant="link" onClick={() => navigate("login")}>← Voltar para o login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}
