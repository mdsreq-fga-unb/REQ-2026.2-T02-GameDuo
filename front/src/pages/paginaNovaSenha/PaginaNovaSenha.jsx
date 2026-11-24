import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import PasswordRulesChecklist from '../../components/passwordRulesChecklist/PasswordRulesChecklist';
import { api } from '../../services/api';
import { isStrongPassword } from '../../utils/validators';

// Rota: /nova-senha
// Todos os estilos desta página vêm dos componentes, por isso ela não tem .css próprio.
function PaginaNovaSenha() {
  const navigate = useNavigate();
  const { email, codigo } = useLocation().state ?? {};
  const [enviando, setEnviando] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirm, setRevealConfirm] = useState(false);
  const [error, setError] = useState("");

  if (!email || !codigo) return <Navigate to="/recuperar-senha" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (!isStrongPassword(password)) {
      setError("Complete todas as regras da missão.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      await api("/senha/redefinir", { method: "POST", body: { email, codigo, senha: password, senha_confirmation: confirm } });
      navigate("/senha-alterada", { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Definir nova senha" showLogo={false} />
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit}>
          <Input label="Nova senha" value={password} onChange={setPassword} placeholder="Digite sua nova senha" type="password" reveal={revealPassword} onReveal={() => setRevealPassword(!revealPassword)} />
          <Input label="Confirmar nova senha" value={confirm} onChange={setConfirm} placeholder="Repita sua nova senha" type="password" reveal={revealConfirm} onReveal={() => setRevealConfirm(!revealConfirm)} />
          <PasswordRulesChecklist password={password} />
          <Button type="submit" className="btn--full" disabled={enviando}>Salvar senha</Button>
        </form>
        <div className="auth-links">
          <Button variant="link" onClick={() => navigate("/recuperar-senha")}>Pedir novo código</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaNovaSenha;
