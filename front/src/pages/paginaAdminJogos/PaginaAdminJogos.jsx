import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaginaAdminJogos.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import EmptyState from '../../components/emptyState/EmptyState';
import Message from '../../components/message/Message';
import Modal from '../../components/modal/Modal';
import { api } from '../../services/api';

// Rota: /admin/jogos — RF50. Jogos ativos aparecem no catálogo e nas ofertas; inativos não.
// O formulário manda, junto com a navegação, success → "Jogo salvo com sucesso!".
// Excluir só funciona para jogo sem ofertas; os demais o back recusa (409) e devem ser desativados.
function PaginaAdminJogos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jogos, setJogos] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(location.state?.success ? { kind: "success", text: location.state.success } : null);
  const [paraExcluir, setParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const tratarErro = (err) => {
    if (err.status === 401) {
      navigate("/login", { replace: true, state: { voltarPara: "/admin/jogos" } });
      return;
    }
    setFeedback({ kind: "error", text: err.message });
  };

  useEffect(() => {
    api("/admin/jogos")
      .then((data) => setJogos(data.jogos))
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login", { replace: true, state: { voltarPara: "/admin/jogos" } });
          return;
        }
        setError(err.message);
      });
  }, [navigate]);

  const excluir = async () => {
    const jogo = paraExcluir;
    setExcluindo(true);
    try {
      const data = await api(`/admin/jogos/${jogo.id}`, { method: "DELETE" });
      setJogos((lista) => lista.filter((item) => item.id !== jogo.id));
      setFeedback({ kind: "success", text: data.message });
    } catch (err) {
      tratarErro(err);
    } finally {
      setExcluindo(false);
      setParaExcluir(null);
    }
  };

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/admin")}>← Voltar ao painel</Button>
        <div className="admin-title admin-jogos__topo">
          <div>
            <p className="eyebrow">PAINEL ADMINISTRATIVO</p>
            <h1>Jogos</h1>
          </div>
          <Button onClick={() => navigate("/admin/jogos/novo")}>Adicionar Jogo</Button>
        </div>

        {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
        {error && <Message kind="error">{error}</Message>}
        {!jogos && !error && <Message kind="info">Carregando...</Message>}

        {jogos && jogos.length === 0 && (
          <EmptyState title="Nenhum jogo cadastrado" text="Clique em Adicionar Jogo para cadastrar o primeiro." />
        )}

        {jogos && jogos.length > 0 && (
          <ul className="admin-lista">
            {jogos.map((jogo) => (
              <li key={jogo.id} className="admin-item">
                <span className="admin-item__dados">
                  <b>{jogo.nome}</b>
                  <small className={jogo.ativo ? "situacao situacao--ativo" : "situacao"}>{jogo.ativo ? "Ativo" : "Inativo"}</small>
                </span>
                <span className="admin-item__acoes">
                  <Button variant="link" onClick={() => navigate(`/admin/jogos/${jogo.id}/editar`)}>Editar</Button>
                  <Button variant="link" onClick={() => setParaExcluir(jogo)}>Excluir</Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Modal
        aberto={Boolean(paraExcluir)}
        tipo="perigo"
        titulo="Excluir jogo?"
        confirmar="Excluir jogo"
        cancelar="Cancelar"
        carregando={excluindo}
        onConfirmar={excluir}
        onCancelar={() => setParaExcluir(null)}
      >
        <p><b>{paraExcluir?.nome}</b></p>
        <p>Esta ação não pode ser desfeita.</p>
      </Modal>
    </MainLayout>
  );
}

export default PaginaAdminJogos;
