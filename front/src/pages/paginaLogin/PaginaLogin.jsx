import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import { useAuth } from '../../context/AuthContext';

// Rota: /login
// Outras telas podem mandar, junto com a navegação (location.state):
//   success    → mensagem verde no topo (ex.: "Conta criada com sucesso!")
//   voltarPara → para onde ir depois de entrar (padrão: catálogo)
// Os estilos desta página estão no AuthLayout.css, por isso ela não tem .css próprio.
function PaginaLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { entrar } = useAuth();
  const success = location.state?.success;
  const voltarPara = location.state?.voltarPara ?? "/";

  const [email, setEmail] = useState(location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Informe e-mail e senha.");
      return;
    }

    setError("");
    setEnviando(true);
    try {
      await entrar(email, password);
      navigate(voltarPara, { replace: true });
    } catch (err) {
      setError(err.status === 401 ? "E-mail ou senha incorretos. Confira os dados e tente novamente." : err.message);
      setEnviando(false);
    }
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Entre na sua conta" subtitle="Encontre sua próxima dupla." />
        {success && !error && <Message kind="success">{success}</Message>}
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit}>
          <Input label="E-mail" value={email} onChange={setEmail} placeholder="Digite seu e-mail" type="email" autoComplete="email" />
          <Input label="Senha" value={password} onChange={setPassword} placeholder="Digite sua senha" type="password" reveal={reveal} onReveal={() => setReveal(!reveal)} autoComplete="current-password" />
          <Button type="submit" className="btn--full" disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</Button>
        </form>
        <div className="auth-links">
          <p>Não tem uma conta? <Button variant="link" onClick={() => navigate("/cadastro")}>Criar conta</Button></p>
          <p>Esqueceu sua senha? <Button variant="link" onClick={() => navigate("/recuperar-senha")}>Recuperar senha</Button></p>
        </div>
      </DialogPanel>
      <Button variant="ghost" className="back-floating" onClick={() => navigate("/")}>← Voltar ao catálogo</Button>
    </AuthLayout>
  );
}

export default PaginaLogin;
