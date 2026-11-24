import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaginaContratacoes.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import EmptyState from '../../components/emptyState/EmptyState';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import Modal from '../../components/modal/Modal';
import { api, errosPorCampo } from '../../services/api';
import { avisarCarteiraAtualizada, formatarMoedas } from '../../utils/moedas';
import { formatarSessao, resultados, statusContratacao } from '../../utils/sessoes';

// Rota: /contratacoes — sessões que a pessoa contratou e, se for prestadora, as que vendeu.
function PaginaContratacoes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contratacoes, setContratacoes] = useState(null);
  const [feedback, setFeedback] = useState(location.state?.success ? { kind: "success", text: location.state.success } : null);
  // acao: { tipo: "cancelar" | resultado, contratacao }
  const [acao, setAcao] = useState(null);
  const [justificativa, setJustificativa] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(
    () => api("/contratacoes")
      .then((data) => setContratacoes(data.contratacoes))
      .catch((err) => {
        if (err.status === 401) navigate("/login", { replace: true, state: { voltarPara: "/contratacoes" } });
        else setFeedback({ kind: "error", text: err.message });
      }),
    [navigate],
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  const abrir = (tipo, contratacao) => {
    setAcao({ tipo, contratacao });
    setJustificativa("");
    setErro("");
  };

  const confirmar = async () => {
    const { tipo, contratacao } = acao;
    if (tipo !== "cancelar" && tipo !== "ocorreu" && !justificativa.trim()) {
      setErro("Conte o que aconteceu.");
      return;
    }

    setEnviando(true);
    try {
      const data = tipo === "cancelar"
        ? await api(`/contratacoes/${contratacao.id}/cancelar`, { method: "POST" })
        : await api(`/contratacoes/${contratacao.id}/resultado`, { method: "POST", body: { resultado: tipo, justificativa: justificativa.trim() || null } });
      setFeedback({ kind: "success", text: data.message });
      avisarCarteiraAtualizada();
      setAcao(null);
    } catch (err) {
      const campo = errosPorCampo(err).justificativa;
      if (campo) setErro(campo);
      else {
        setFeedback({ kind: "error", text: err.message });
        setAcao(null);
      }
    } finally {
      setEnviando(false);
      carregar();
    }
  };

  const cancelando = acao?.tipo === "cancelar";

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/")}>← Voltar ao catálogo</Button>
        <div className="account-title">
          <p className="eyebrow">MISSÕES</p>
          <h1>Minhas sessões</h1>
        </div>
        {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
        {contratacoes === null && !feedback && <Message kind="info">Carregando sessões...</Message>}
        {contratacoes?.length === 0 && <EmptyState title="Nenhuma sessão ainda" text="Escolha uma oferta no catálogo para contratar a primeira." />}

        <div className="bookings">
          {contratacoes?.map((c) => {
            const status = statusContratacao[c.status] ?? { rotulo: c.status, tom: "cinza" };
            return (
              <article className="booking" key={c.id} aria-label={c.titulo}>
                <div className="booking__head">
                  <div>
                    <p className="eyebrow">{c.papel === "consumidor" ? "Você contratou" : "Você vai atender"}</p>
                    <h3>{c.titulo}</h3>
                  </div>
                  <span className={`booking__status booking__status--${status.tom}`}>{status.rotulo}</span>
                </div>
                <dl className="booking__data">
                  <div><dt>Quando (Brasília)</dt><dd>{formatarSessao(c.inicio)} · {c.duracao} min</dd></div>
                  <div><dt>Serviço</dt><dd>{c.jogo} · {c.modalidade}</dd></div>
                  <div><dt>Valor</dt><dd>{formatarMoedas(c.preco)} moedas</dd></div>
                  <div><dt>{c.papel === "consumidor" ? "Prestador" : "Jogador"}</dt><dd>@{c.outra_parte.nickname}</dd></div>
                  <div><dt>Contato ({c.comunicacao})</dt><dd>{c.outra_parte.contato}</dd></div>
                  {c.condicoes && <div><dt>Condições</dt><dd>{c.condicoes}</dd></div>}
                </dl>

                {c.cancelada_por && <p className="booking__note">Cancelada pelo {c.cancelada_por}. As {formatarMoedas(c.preco)} moedas voltaram ao consumidor.</p>}
                {c.meu_resultado && <p className="booking__note">Você informou: {resultados[c.meu_resultado]}.</p>}
                {c.resultado_outra_parte && <p className="booking__note">A outra parte informou: {resultados[c.resultado_outra_parte]}.</p>}
                {c.status === "em_analise" && <p className="booking__note">Valor retido. Envie detalhes e evidências para {c.email_sac}.</p>}
                {c.motivo_decisao && <p className="booking__note">Decisão da administração: {c.motivo_decisao}</p>}
                {c.pode_registrar && <p className="booking__note">Informe o resultado até {formatarSessao(c.prazo_resultado)}.</p>}

                <div className="booking__actions">
                  {c.pode_cancelar && <Button variant="ghost" onClick={() => abrir("cancelar", c)}>Cancelar sessão</Button>}
                  {c.pode_registrar && (
                    <>
                      <Button onClick={() => abrir("ocorreu", c)}>Ocorreu</Button>
                      <Button variant="secondary" onClick={() => abrir("nao_ocorreu", c)}>Não ocorreu</Button>
                      <Button variant="ghost" onClick={() => abrir("problema", c)}>Teve problemas</Button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Modal
        aberto={Boolean(acao)}
        tipo={acao?.tipo === "ocorreu" ? "sucesso" : "perigo"}
        titulo={cancelando ? "Cancelar sessão?" : "Registrar resultado?"}
        confirmar={cancelando ? "Cancelar sessão" : "Registrar"}
        cancelar="Voltar"
        carregando={enviando}
        onConfirmar={confirmar}
        onCancelar={() => setAcao(null)}
      >
        <p><b>{acao?.contratacao.titulo}</b></p>
        {cancelando && <p>Todas as moedas reservadas voltam para o consumidor e o horário fica livre.</p>}
        {acao && !cancelando && <p>{resultados[acao.tipo]}. Depois de registrar, não dá para mudar.</p>}
        {acao && !cancelando && acao.tipo !== "ocorreu" && (
          <Input label="O que aconteceu?" value={justificativa} onChange={setJustificativa} multiline error={erro} />
        )}
      </Modal>
    </MainLayout>
  );
}

export default PaginaContratacoes;
