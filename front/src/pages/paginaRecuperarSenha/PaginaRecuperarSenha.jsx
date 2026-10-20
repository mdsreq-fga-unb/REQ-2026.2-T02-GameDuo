import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/authLayout/AuthLayout';
import AuthHeading from '../../components/authHeading/AuthHeading';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import RecoveryChannelPicker from '../../components/recoveryChannelPicker/RecoveryChannelPicker';
import { isValidEmail, isValidPhone } from '../../utils/validators';

// Configuração do campo para cada canal de recuperação.
const channelConfig = {
  email: { label: "E-mail cadastrado", placeholder: "Digite seu e-mail", type: "email", error: "Informe um e-mail válido.", isValid: isValidEmail },
  phone: { label: "Telefone cadastrado", placeholder: "Informe seu telefone com DDD", type: "tel", error: "Informe telefone e DDD.", isValid: isValidPhone },
};

// Rota: /recuperar-senha
// Os estilos desta página estão no AuthLayout.css, por isso ela não tem .css próprio.
function PaginaRecuperarSenha() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const config = channelConfig[channel];

  const changeChannel = (next) => {
    setChannel(next);
    setValue("");
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    if (config.isValid(value)) navigate("/validar-codigo");
    else setError(config.error);
  };

  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Recuperar senha" />
        <p className="intro-copy">Escolha como deseja receber o código.</p>
        <RecoveryChannelPicker value={channel} onChange={changeChannel} />
        <form onSubmit={submit}>
          <Input label={config.label} value={value} onChange={setValue} placeholder={config.placeholder} type={config.type} error={error} />
          <Button type="submit" className="btn--full">Enviar código</Button>
        </form>
        <div className="auth-links">
          <Button variant="link" onClick={() => navigate("/login")}>← Voltar para o login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaRecuperarSenha;
