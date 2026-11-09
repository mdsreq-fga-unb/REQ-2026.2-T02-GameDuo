import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './PaginaAdminFormularioJogo.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import { api, errosPorCampo } from '../../services/api';

// Rotas: /admin/jogos/novo (formulário vazio) e /admin/jogos/:id/editar (preenchido) — RF50.
function PaginaAdminFormularioJogo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = Boolean(id);

  const [nome, setNome] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [carregando, setCarregando] = useState(editando);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // edição: a API não tem rota de um jogo só, então busca a lista e acha pelo id
  useEffect(() => {
    if (!editando) return;
    api("/admin/jogos")
      .then((data) => {
        const jogo = data.jogos.find((item) => String(item.id) === id);
        if (!jogo) {
          setError("Jogo não encontrado.");
          return;
        }
        setNome(jogo.nome);
        setAtivo(jogo.ativo);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCarregando(false));
  }, [editando, id]);

  const salvar = async (event) => {
    event.preventDefault();
    if (!nome.trim()) {
      setErrors({ nome: "Informe o nome do jogo." });
      return;
    }

    setErrors({});
    setError("");
    setEnviando(true);
    try {
      const body = { nome: nome.trim(), ativo };
      const data = editando
        ? await api(`/admin/jogos/${id}`, { method: "PUT", body })
        : await api("/admin/jogos", { method: "POST", body });
      navigate("/admin/jogos", { state: { success: data.message } });
    } catch (err) {
      if (err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      // 409 (nome repetido) e 422 vêm com errors.nome: a mensagem aparece no campo
      setErrors(errosPorCampo(err));
      if (!err.errors) setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/admin/jogos")}>← Voltar à lista</Button>
        <DialogPanel>
          <p className="eyebrow">{editando ? "EDITAR JOGO" : "NOVO JOGO"}</p>
          <h2>{editando ? "Editar jogo" : "Adicionar jogo"}</h2>

          {error && <Message kind="error">{error}</Message>}
          {carregando && <Message kind="info">Carregando...</Message>}

          {!carregando && !(editando && error === "Jogo não encontrado.") && (
            <form onSubmit={salvar}>
              <Input label="Nome do jogo" value={nome} onChange={setNome} placeholder="Ex.: Valorant" error={errors.nome} />

              <fieldset className="situacao-campo">
                <legend className="field__label">Situação</legend>
                <label>
                  <input type="radio" name="situacao" checked={ativo} onChange={() => setAtivo(true)} /> Ativo
                </label>
                <label>
                  <input type="radio" name="situacao" checked={!ativo} onChange={() => setAtivo(false)} /> Inativo
                </label>
                <small>Jogos inativos não aparecem no filtro do catálogo nem em novas ofertas.</small>
              </fieldset>

              <Button type="submit" className="btn--full" disabled={enviando}>{enviando ? "Salvando..." : "Salvar Jogo"}</Button>
              <Button variant="secondary" className="btn--full" onClick={() => navigate("/admin/jogos")}>Cancelar</Button>
            </form>
          )}
        </DialogPanel>
      </main>
    </MainLayout>
  );
}

export default PaginaAdminFormularioJogo;
