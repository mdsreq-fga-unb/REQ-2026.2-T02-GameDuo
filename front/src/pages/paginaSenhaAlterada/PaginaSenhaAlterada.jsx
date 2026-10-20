import { useNavigate } from 'react-router-dom';
import './PaginaSenhaAlterada.css';
import AuthLayout from '../../components/authLayout/AuthLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import PixelIcon from '../../components/pixelIcon/PixelIcon';

// Rota: /senha-alterada
function PaginaSenhaAlterada() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <DialogPanel>
        <div className="stage-clear">
          <p className="eyebrow">LEVEL UP!</p>
          <div className="trophy"><PixelIcon type="trophy" /></div>
          <h1>Stage clear!</h1>
          <Message kind="success">Senha alterada com sucesso.</Message>
          <p>Sua conta está protegida. Use a nova senha no próximo acesso.</p>
          <Button className="btn--full" onClick={() => navigate("/login")}>Voltar ao login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

export default PaginaSenhaAlterada;
