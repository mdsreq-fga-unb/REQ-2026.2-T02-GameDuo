import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import { api, errosPorCampo } from '../../services/api';
import { isValidEmail } from '../../utils/validators';

// Rota: /recuperar-senha — só por e-mail (RN04).
// Os estilos desta página estão no AuthLayout.css, por isso ela não tem .css próprio.
function PaginaRecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [falha, setFalha] = useState("");
  const [enviando, setEnviando] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!isValidEmail(email.trim())) {
      setError("Informe um e-mail válido.");
      return;
    }

    setError("");
    setFalha("");
    setEnviando(true);
    try {
      await api("/senha/solicitar", { method: "POST", body: { email: email.trim() } });
      navigate("/validar-codigo", { state: { email: email.trim() } });
    } catch (err) {
      const campo = errosPorCampo(err).email;
      if (campo) setError(campo);
      else setFalha(err.message);
      setEnviando(false);
    }
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Recuperar senha" />
        <p className="intro-copy">Enviaremos um código para o e-mail da sua conta.</p>
        {falha && <Message kind="error">{falha}</Message>}
        <form onSubmit={submit}>
          <Input label="E-mail cadastrado" value={email} onChange={setEmail} placeholder="Digite seu e-mail" type="email" error={error} autoComplete="email" />
          <Button type="submit" className="btn--full" disabled={enviando}>{enviando ? "Enviando..." : "Enviar código"}</Button>
        </form>
        <div className="auth-links">
          <Button variant="link" onClick={() => navigate("/login")}>← Voltar para o login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaRecuperarSenha;
