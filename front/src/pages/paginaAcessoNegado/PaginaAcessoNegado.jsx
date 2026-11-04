import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';

// Exibida pela RotaAdmin quando uma conta sem papel de administrador abre /admin.
function PaginaAcessoNegado() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <main className="detail-main">
        <DialogPanel>
          <p className="eyebrow">ACESSO NEGADO</p>
          <Message kind="error">Você não tem permissão para acessar esta área.</Message>
          <Button className="btn--full" onClick={() => navigate("/")}>Voltar ao Catálogo</Button>
        </DialogPanel>
      </main>
    </MainLayout>
  );
}

export default PaginaAcessoNegado;
