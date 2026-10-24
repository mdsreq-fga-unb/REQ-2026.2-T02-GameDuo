import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaCadastro.css';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import { api, errosPorCampo } from '../../services/api';
import { isValidEmail } from '../../utils/validators';

const emptyForm = { nickname: "", nome: "", email: "", password: "", confirm: "" };

// Devolve um objeto com a mensagem de erro de cada campo inválido.
function validate(data) {
  const errors = {};
  if (data.nickname.trim().length < 3) errors.nickname = "Use pelo menos 3 caracteres.";
  if (!data.nome.trim()) errors.nome = "Informe seu nome.";
  if (!isValidEmail(data.email)) errors.email = "Informe um e-mail válido.";
  if (data.password.length < 8) errors.password = "A senha precisa ter 8 caracteres.";
  if (data.confirm !== data.password) errors.confirm = "As senhas não coincidem.";
  return errors;
}

// Nomes dos campos na API → nomes dos campos no formulário.
const campoDoFormulario = { senha: "password", senha_confirmation: "confirm" };

// Rota: /cadastro
function PaginaCadastro() {
  const navigate = useNavigate();
  const [data, setData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirm, setRevealConfirm] = useState(false);

  const update = (key) => (value) => setData({ ...data, [key]: value });

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) return;

    setEnviando(true);
    try {
      await api("/usuarios", {
        method: "POST",
        body: {
          nickname: data.nickname.trim(),
          nome: data.nome.trim(),
          email: data.email.trim(),
          senha: data.password,
          senha_confirmation: data.confirm,
        },
      });
      navigate("/login", { state: { success: "Conta criada com sucesso! Entre para continuar.", email: data.email.trim() } });
    } catch (err) {
      const porCampo = errosPorCampo(err);
      setErrors(Object.fromEntries(Object.entries(porCampo).map(([campo, msg]) => [campoDoFormulario[campo] ?? campo, msg])));
      if (!Object.keys(porCampo).length) setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <AuthLayout>
      <DialogPanel size="wide">
        <AuthHeading title="Criar conta" subtitle="Encontre coaching e duo ou ofereça seus serviços." />
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit} className="form-grid">
          <div className="form-grid__full">
            <Input label="Nickname" value={data.nickname} onChange={update("nickname")} placeholder="Nickname/Apelido" help="Este será seu nome público no GameDuo." error={errors.nickname} />
          </div>
          <Input label="Nome" value={data.nome} onChange={update("nome")} placeholder="Seu nome" autoComplete="name" error={errors.nome} />
          <Input label="E-mail" value={data.email} onChange={update("email")} placeholder="Digite seu e-mail" type="email" autoComplete="email" error={errors.email} />
          <Input label="Senha" value={data.password} onChange={update("password")} placeholder="Crie sua senha" type="password" reveal={revealPassword} onReveal={() => setRevealPassword(!revealPassword)} autoComplete="new-password" error={errors.password} />
          <Input label="Confirmar senha" value={data.confirm} onChange={update("confirm")} placeholder="Repita sua senha" type="password" reveal={revealConfirm} onReveal={() => setRevealConfirm(!revealConfirm)} autoComplete="new-password" error={errors.confirm} />
          <div className="form-grid__full"><Button type="submit" className="btn--full" disabled={enviando}>{enviando ? "Criando..." : "Criar conta"}</Button></div>
        </form>
        <div className="auth-links">
          <p>Já tem uma conta? <Button variant="link" onClick={() => navigate("/login")}>Entrar</Button></p>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaCadastro;
