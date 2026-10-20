import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaCadastro.css';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import { isValidEmail, isValidPhone } from '../../utils/validators';

const emptyForm = { nickname: "", email: "", phone: "", password: "", confirm: "" };

// Devolve um objeto com a mensagem de erro de cada campo inválido.
function validate(data) {
  const errors = {};
  if (data.nickname.trim().length < 3) errors.nickname = "Use pelo menos 3 caracteres.";
  if (!isValidEmail(data.email)) errors.email = "Informe um e-mail válido.";
  if (!isValidPhone(data.phone)) errors.phone = "Informe telefone e DDD.";
  if (data.password.length < 8) errors.password = "A senha precisa ter 8 caracteres.";
  if (data.confirm !== data.password) errors.confirm = "As senhas não coincidem.";
  return errors;
}

// Rota: /cadastro
function PaginaCadastro() {
  const navigate = useNavigate();
  const [data, setData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirm, setRevealConfirm] = useState(false);

  const update = (key) => (value) => setData({ ...data, [key]: value });

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) {
      navigate("/login", { state: { success: "Conta criada com sucesso!" } });
    }
  };

  return (
    <AuthLayout>
      <DialogPanel size="wide">
        <AuthHeading title="Criar conta" subtitle="Encontre coaching e duo ou ofereça seus serviços." />
        <form onSubmit={submit} className="form-grid">
          <div className="form-grid__full">
            <Input label="Nickname" value={data.nickname} onChange={update("nickname")} placeholder="Nickname/Apelido" help="Este será seu nome público no GameDuo." error={errors.nickname} />
          </div>
          <Input label="E-mail" value={data.email} onChange={update("email")} placeholder="Digite seu e-mail" type="email" error={errors.email} />
          <Input label="Telefone" value={data.phone} onChange={update("phone")} placeholder="Informe seu telefone com DDD" type="tel" error={errors.phone} />
          <Input label="Senha" value={data.password} onChange={update("password")} placeholder="Crie sua senha" type="password" reveal={revealPassword} onReveal={() => setRevealPassword(!revealPassword)} error={errors.password} />
          <Input label="Confirmar senha" value={data.confirm} onChange={update("confirm")} placeholder="Repita sua senha" type="password" reveal={revealConfirm} onReveal={() => setRevealConfirm(!revealConfirm)} error={errors.confirm} />
          <div className="form-grid__full"><Button type="submit" className="btn--full">Criar conta</Button></div>
        </form>
        <div className="auth-links">
          <p>Já tem uma conta? <Button variant="link" onClick={() => navigate("/login")}>Entrar</Button></p>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaCadastro;
