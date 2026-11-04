import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './PaginaAdminDetalheUsuario.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import { api } from '../../services/api';

// Rota: /admin/usuarios/:email — RF44, somente consulta.
// Sem botões de editar, banir ou sancionar; senha e chave Pix nunca chegam aqui.
function PaginaAdminDetalheUsuario() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  // volta para a lista com a mesma busca de antes (quando veio dela)
  const voltar = () => navigate(`/admin/usuarios${location.state?.lista ?? ""}`);

  useEffect(() => {
    api(`/admin/usuarios/${encodeURIComponent(email)}`)
      .then(setUsuario)
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login", { replace: true, state: { voltarPara: location.pathname } });
          return;
        }
        setError(err.message);
      });
  }, [email, navigate, location.pathname]);

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={voltar}>← Voltar à lista</Button>

        {error && <Message kind="error">{error}</Message>}
        {!usuario && !error && <Message kind="info">Carregando...</Message>}

        {usuario && (
          <DialogPanel size="wide">
            <p className="eyebrow">DETALHE DO USUÁRIO</p>
            <h1>{usuario.nickname}</h1>
            <dl className="admin-detalhe">
              <dt>Nome</dt>
              <dd>{usuario.nome}</dd>
              <dt>E-mail</dt>
              <dd>{usuario.email}</dd>
              <dt>Papel</dt>
              <dd>{usuario.role === "admin" ? "Administrador" : "Usuário"}</dd>
              <dt>Presta serviço</dt>
              <dd>{usuario.presta_servico ? "Sim" : "Não"}</dd>
              <dt>Jogos</dt>
              <dd>{usuario.jogos.length ? usuario.jogos.join(", ") : "Nenhum"}</dd>
              <dt>Ofertas cadastradas</dt>
              <dd>{usuario.ofertas_ativas}</dd>
              <dt>Dados de recebimento</dt>
              <dd>{usuario.dados_recebimento_cadastrados ? "Cadastrados" : "Não cadastrados"}</dd>
            </dl>
          </DialogPanel>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaAdminDetalheUsuario;
