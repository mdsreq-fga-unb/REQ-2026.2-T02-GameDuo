import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaMinhasOfertas.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import Modal from '../../components/modal/Modal';
import PixelIcon from '../../components/pixelIcon/PixelIcon';
import Select from '../../components/select/Select';
import TagRow from '../../components/tagRow/TagRow';
import { api, errosPorCampo } from '../../services/api';
import { useJogosAtivos } from '../../utils/useJogosAtivos';

const modalidades = ["Coaching", "Duo"];

// jogo vazio: assume o primeiro jogo ativo quando a lista chegar da API
const emptyForm = { titulo: "", descricao: "", jogo: "", modalidade: modalidades[0], nivel: "", duracao: "60", preco: "" };

// Oferta da API → valores do formulário (os inputs trabalham com texto).
function paraFormulario(oferta) {
  return {
    titulo: oferta.titulo,
    descricao: oferta.descricao ?? "",
    jogo: oferta.jogo,
    modalidade: oferta.modalidade,
    nivel: oferta.nivel ?? "",
    duracao: String(oferta.duracao),
    preco: String(oferta.preco),
  };
}

// Rota: /minhas-ofertas — só para prestadores (o App.jsx redireciona os demais).
// Formulário à esquerda (criar ou editar) e lista das ofertas do prestador à direita.
function PaginaMinhasOfertas() {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  // id da oferta em edição; null = criando uma nova
  const [editando, setEditando] = useState(null);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [paraExcluir, setParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const jogosAtivos = useJogosAtivos();
  const jogoEscolhido = form.jogo || jogosAtivos[0] || "";
  // ao editar uma oferta cujo jogo foi desativado, o jogo atual continua na lista
  const jogos = jogoEscolhido && !jogosAtivos.includes(jogoEscolhido) ? [jogoEscolhido, ...jogosAtivos] : jogosAtivos;

  const carregar = () =>
    api("/minhas-ofertas")
      .then((data) => setOfertas(data.ofertas))
      .catch((err) => setFeedback({ kind: "error", text: err.message }));

  useEffect(() => {
    carregar();
  }, []);

  const update = (key) => (value) => setForm({ ...form, [key]: value });

  const limpar = () => {
    setForm(emptyForm);
    setEditando(null);
    setErrors({});
  };

  const editar = (oferta) => {
    setForm(paraFormulario(oferta));
    setEditando(oferta.id);
    setErrors({});
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const salvar = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setFeedback(null);

    const body = {
      ...form,
      jogo: jogoEscolhido,
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      nivel: form.nivel.trim() || null,
      duracao: Number(form.duracao),
      preco: Number(form.preco),
    };

    try {
      const data = editando
        ? await api(`/ofertas/${editando}`, { method: "PUT", body })
        : await api("/ofertas", { method: "POST", body });
      setFeedback({ kind: "success", text: data.message });
      limpar();
      carregar();
    } catch (err) {
      setErrors(errosPorCampo(err));
      setFeedback({ kind: "error", text: err.errors ? "Confira os campos destacados." : err.message });
    } finally {
      setEnviando(false);
    }
  };

  const excluir = async () => {
    const oferta = paraExcluir;
    setExcluindo(true);
    try {
      const data = await api(`/ofertas/${oferta.id}`, { method: "DELETE" });
      setFeedback({ kind: "success", text: data.message });
      if (editando === oferta.id) limpar();
      carregar();
    } catch (err) {
      setFeedback({ kind: "error", text: err.message });
    } finally {
      setExcluindo(false);
      setParaExcluir(null);
    }
  };

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/minha-conta")}>← Voltar para minha conta</Button>
        <div className="account-title">
          <p className="eyebrow">PAINEL DO PRESTADOR</p>
          <h1>Minhas ofertas</h1>
        </div>
        {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
        <div className="detail-grid">
          <DialogPanel>
            <p className="eyebrow">{editando ? "EDITANDO OFERTA" : "NOVA OFERTA"}</p>
            <h2>{editando ? "Editar oferta" : "Publicar oferta"}</h2>
            <form onSubmit={salvar} className="offer-form">
              <Input label="Título" value={form.titulo} onChange={update("titulo")} placeholder="Ex.: Mira e spray control no CS2" error={errors.titulo} />
              <Input label="Descrição (opcional)" value={form.descricao} onChange={update("descricao")} placeholder="O que o jogador vai aprender ou fazer" error={errors.descricao} />
              <div className="offer-form__row">
                <Select label="Jogo" value={jogoEscolhido} options={jogos} onChange={update("jogo")} />
                <Select label="Modalidade" value={form.modalidade} options={modalidades} onChange={update("modalidade")} />
              </div>
              <Input label="Nível (opcional)" value={form.nivel} onChange={update("nivel")} placeholder="Ex.: Faceit Nível 10, Diamante I" error={errors.nivel} />
              <div className="offer-form__row">
                <Input label="Duração (min)" value={form.duracao} onChange={update("duracao")} type="number" placeholder="60" error={errors.duracao} />
                <Input label="Preço (créditos)" value={form.preco} onChange={update("preco")} type="number" placeholder="100" error={errors.preco} />
              </div>
              {(errors.jogo || errors.modalidade) && <Message kind="error">{errors.jogo || errors.modalidade}</Message>}
              <Button type="submit" className="btn--full" disabled={enviando}>
                {enviando ? "Salvando..." : editando ? "Salvar alterações" : "Publicar oferta"}
              </Button>
              {editando && <Button variant="secondary" className="btn--full" onClick={limpar}>Cancelar edição</Button>}
            </form>
          </DialogPanel>
          <DialogPanel>
            <p className="eyebrow">PUBLICADAS</p>
            <h2>{ofertas.length} {ofertas.length === 1 ? "oferta" : "ofertas"}</h2>
            {ofertas.length === 0 ? (
              <p className="detail-copy">Você ainda não publicou nenhuma oferta. Use o formulário para criar a primeira.</p>
            ) : (
              <ul className="my-offers">
                {ofertas.map((oferta) => (
                  <li key={oferta.id} className={editando === oferta.id ? "is-editing" : ""}>
                    <b>{oferta.titulo}</b>
                    <TagRow tags={[oferta.jogo, oferta.modalidade]} />
                    <span className="my-offers__meta">{oferta.duracao} min · <PixelIcon type="coin" /> {oferta.preco}</span>
                    <div className="my-offers__actions">
                      <Button variant="ghost" onClick={() => navigate(`/oferta/${oferta.id}`)}><PixelIcon type="eye" /> Ver</Button>
                      <Button variant="secondary" onClick={() => editar(oferta)} disabled={editando === oferta.id}>{editando === oferta.id ? "Editando" : "Editar"}</Button>
                      <Button variant="ghost" className="my-offers__excluir" onClick={() => setParaExcluir(oferta)}>Excluir</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DialogPanel>
        </div>
      </main>
      <Modal
        aberto={Boolean(paraExcluir)}
        tipo="perigo"
        titulo="Excluir oferta?"
        confirmar="Excluir oferta"
        cancelar="Manter oferta"
        carregando={excluindo}
        onConfirmar={excluir}
        onCancelar={() => setParaExcluir(null)}
      >
        <p><b>{paraExcluir?.titulo}</b></p>
        <p>Ela deixa de aparecer para os jogadores e não dá para desfazer.</p>
      </Modal>
    </MainLayout>
  );
}

export default PaginaMinhasOfertas;
