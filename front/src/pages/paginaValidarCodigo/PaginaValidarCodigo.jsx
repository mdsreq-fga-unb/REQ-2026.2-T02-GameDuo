import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaValidarCodigo.css';
import '../../components/input/Input.css';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import PixelIcon from '../../components/pixelIcon/PixelIcon';
import { demoCredentials } from '../../mocks/user';
import { onlyDigits } from '../../utils/validators';

const CODE_LENGTH = 6;

// Rota: /validar-codigo
function PaginaValidarCodigo() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  // message: { kind: "success" | "error", text } ou null
  const [message, setMessage] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    if (code === demoCredentials.recoveryCode) navigate("/nova-senha");
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
          <Button variant="link" onClick={() => navigate("/recuperar-senha")}>Corrigir e-mail ou telefone</Button>
          <Button variant="link" onClick={() => navigate("/login")}>Voltar para o login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaValidarCodigo;
