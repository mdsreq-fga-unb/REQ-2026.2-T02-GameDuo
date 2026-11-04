import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaPainelAdmin.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import Message from '../../components/message/Message';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

// Rota: /admin — só para administradores (a RotaAdmin, no App.jsx, barra os demais).
function PaginaPainelAdmin() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [resumo, setResumo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/resumo")
      .then(setResumo)
      .catch((err) => {
        // sessão vencida: volta para o login; qualquer outro erro aparece na tela
        if (err.status === 401) {
          navigate("/login", { replace: true, state: { voltarPara: "/admin" } });
          return;
        }
        setError(err.message);
      });
  }, [navigate]);

  return (
    <MainLayout>
      <main className="detail-main">
        <div className="admin-title">
          <p className="eyebrow">PAINEL ADMINISTRATIVO</p>
          <h1>Olá, {usuario.nickname}.</h1>
          <p className="detail-copy">Escolha uma área para consultar.</p>
        </div>

        {error && <Message kind="error">{error}</Message>}
        {!resumo && !error && <Message kind="info">Carregando...</Message>}

        {resumo && (
          <div className="admin-cards">
            <section className="admin-card">
              <h2>Usuários</h2>
              <p>Total cadastrados: <b>{resumo.total_usuarios}</b></p>
              <p>Também prestadores: <b>{resumo.total_prestadores}</b></p>
              <Button onClick={() => navigate("/admin/usuarios")}>Ver Usuários</Button>
            </section>
            <section className="admin-card">
              <h2>Jogos</h2>
              <p>Ativos: <b>{resumo.jogos_ativos ?? "—"}</b></p>
              <Button onClick={() => navigate("/admin/jogos")}>Gerenciar Jogos</Button>
            </section>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaPainelAdmin;
