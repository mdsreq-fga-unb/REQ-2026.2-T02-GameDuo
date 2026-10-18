import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout";
import { Button, DialogPanel, Message, PixelIcon } from "@/components/ui";
import { demoCredentials } from "@/mocks/user";
import type { MessageKind, Navigate } from "@/types";
import { onlyDigits } from "@/utils/validators";
import { AuthHeading } from "../components/AuthHeading";

const CODE_LENGTH = 6;

export function PaginaValidarCodigo({ navigate }: { navigate: Navigate }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ kind: MessageKind; text: string } | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (code === demoCredentials.recoveryCode) navigate("nova-senha");
    else setMessage({ kind: "error", text: "Código inválido, expirado ou já utilizado. Tente novamente." });
  };

  const resendCode = () => setMessage({ kind: "success", text: "Se os dados estiverem corretos, um novo código foi enviado." });

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Verifique sua solicitação" showLogo={false} />
        <p className="intro-copy">Se os dados corresponderem a uma conta, você receberá um código pelo canal escolhido.</p>
        {message && <Message kind={message.kind}>{message.text}</Message>}
        <form onSubmit={submit}>
          <label className="field">
            <span className="field__label">Código</span>
            <input
              className="code-input"
              value={code}
              onChange={(event) => setCode(onlyDigits(event.target.value).slice(0, CODE_LENGTH))}
              placeholder="• • • • • •"
              inputMode="numeric"
              aria-label="Digite o código recebido"
            />
            <span className="field__help"><PixelIcon type="hourglass" /> O código é de uso único e expira em 30 minutos.</span>
          </label>
          <p className="demo-hint">CÓDIGO DEMO: {demoCredentials.recoveryCode}</p>
          <Button type="submit" className="btn--full">Validar código</Button>
        </form>
        <div className="auth-links auth-links--stack">
          <Button variant="link" onClick={resendCode}>Solicitar novo código</Button>
          <Button variant="link" onClick={() => navigate("recuperar-senha")}>Corrigir e-mail ou telefone</Button>
          <Button variant="link" onClick={() => navigate("login")}>Voltar para o login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}
