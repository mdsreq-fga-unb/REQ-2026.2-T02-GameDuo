import { AuthLayout } from "@/components/layout";
import { Button, DialogPanel, Message, PixelIcon } from "@/components/ui";
import type { Navigate } from "@/types";

export function PaginaSenhaAlterada({ navigate }: { navigate: Navigate }) {
  return (
    <AuthLayout>
      <DialogPanel>
        <div className="stage-clear">
          <p className="eyebrow">LEVEL UP!</p>
          <div className="trophy"><PixelIcon type="trophy" /></div>
          <h1>Stage clear!</h1>
          <Message kind="success">Senha alterada com sucesso.</Message>
          <p>Sua conta está protegida. Use a nova senha no próximo acesso.</p>
          <Button className="btn--full" onClick={() => navigate("login")}>Voltar ao login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}
