import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './PaginaValidarCodigo.css';
import '../../components/input/Input.css';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import PixelIcon from '../../components/pixelIcon/PixelIcon';
import { api } from '../../services/api';
import { onlyDigits } from '../../utils/validators';

const CODE_LENGTH = 6;

// Rota: /validar-codigo
function PaginaValidarCodigo() {
  const navigate = useNavigate();
  const email = useLocation().state?.email;
  const [code, setCode] = useState("");
  // message: { kind: "success" | "error", text } ou null
  const [message, setMessage] = useState(null);

  const [enviando, setEnviando] = useState(false);

  // abriu a página direto: sem o e-mail não há o que validar
  if (!email) return <Navigate to="/recuperar-senha" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    try {
      await api("/senha/validar", { method: "POST", body: { email, codigo: code } });
      navigate("/nova-senha", { state: { email, codigo: code } });
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
      setEnviando(false);
    }
  };

  const resendCode = async () => {
    try {
      const data = await api("/senha/solicitar", { method: "POST", body: { email } });
      setMessage({ kind: "success", text: data.message });
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
    }
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Verifique sua solicitação" showLogo={false} />
        <p className="intro-copy">Se os dados corresponderem a uma conta, você receberá um código por e-mail.</p>
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
          <Button type="submit" className="btn--full" disabled={enviando}>Validar código</Button>
        </form>
        <div className="auth-links auth-links--stack">
          <Button variant="link" onClick={resendCode}>Solicitar novo código</Button>
          <Button variant="link" onClick={() => navigate("/recuperar-senha")}>Corrigir e-mail</Button>
          <Button variant="link" onClick={() => navigate("/login")}>Voltar para o login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaValidarCodigo;
