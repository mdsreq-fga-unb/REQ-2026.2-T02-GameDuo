import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import { demoCredentials } from '../../mocks/user';

// Rota: /login
// Outras telas podem mandar, junto com a navegação (location.state):
//   success    → mensagem verde no topo (ex.: "Conta criada com sucesso!")
//   voltarPara → para onde ir depois de entrar (padrão: catálogo)
// Os estilos desta página estão no AuthLayout.css, por isso ela não tem .css próprio.
function PaginaLogin({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const success = location.state?.success;
  const voltarPara = location.state?.voltarPara ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (email === demoCredentials.email && password === demoCredentials.password) {
      onLogin();
      navigate(voltarPara, { replace: true });
    } else setError("E-mail ou senha incorretos. Confira os dados e tente novamente.");
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Entre na sua conta" subtitle="Encontre sua próxima dupla." />
        {success && <Message kind="success">{success}</Message>}
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit}>
          <Input label="E-mail" value={email} onChange={setEmail} placeholder="Digite seu e-mail" type="email" autoComplete="email" />
          <Input label="Senha" value={password} onChange={setPassword} placeholder="Digite sua senha" type="password" reveal={reveal} onReveal={() => setReveal(!reveal)} autoComplete="current-password" />
          <p className="demo-hint">ACESSO DEMO: {demoCredentials.email} / {demoCredentials.password}</p>
          <Button type="submit" className="btn--full">Entrar</Button>
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
