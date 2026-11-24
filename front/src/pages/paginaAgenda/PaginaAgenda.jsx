import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import './PaginaAgenda.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import { api, errosPorCampo } from '../../services/api';
import { diasSemana } from '../../utils/sessoes';

// Rota: /minhas-ofertas/:id/agenda — RF14, só para o dono da oferta.
function PaginaAgenda() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [oferta, setOferta] = useState(null);
  const [intervalos, setIntervalos] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [semAcesso, setSemAcesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api(`/ofertas/${id}/agenda`)
      .then((data) => {
        setOferta(data.oferta);
        setIntervalos(data.intervalos);
      })
      .catch((err) => {
        if (err.status === 403 || err.status === 404) setSemAcesso(true);
        else setFeedback({ kind: "error", text: err.message });
      });
  }, [id]);

  if (semAcesso) return <Navigate to="/minhas-ofertas" replace />;

  const adicionar = (dia) => setIntervalos([...intervalos, { dia, inicio: "", fim: "" }]);
  const remover = (indice) => setIntervalos(intervalos.filter((_, i) => i !== indice));
  const mudar = (indice, campo, valor) => setIntervalos(intervalos.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));

  const salvar = async (event) => {
    event.preventDefault();
    if (intervalos.some((item) => !item.inicio || !item.fim)) {
      setFeedback({ kind: "error", text: "Preencha o início e o fim de cada intervalo." });
      return;
    }
    setEnviando(true);
    try {
      const data = await api(`/ofertas/${id}/agenda`, { method: "PUT", body: { intervalos } });
      setIntervalos(data.intervalos);
      setFeedback({ kind: "success", text: data.message });
    } catch (err) {
      setFeedback({ kind: "error", text: Object.values(errosPorCampo(err))[0] ?? err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/minhas-ofertas")}>← Voltar às minhas ofertas</Button>
        <div className="account-title">
          <p className="eyebrow">AGENDA SEMANAL</p>
          <h1>{oferta?.titulo ?? "Agenda"}</h1>
        </div>
        {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
        {!oferta && !feedback && <Message kind="info">Carregando agenda...</Message>}
        {oferta && (
          <DialogPanel size="wide">
            <p className="detail-copy">Horário de Brasília. Cada sessão dura {oferta.duracao} minutos. Um horário contratado some de todas as suas ofertas, e mudar a agenda não altera o que já foi contratado.</p>
            <form onSubmit={salvar}>
              <div className="schedule">
                {diasSemana.map((nome, dia) => (
                  <div className="schedule__day" key={nome}>
                    <div className="schedule__head">
                      <b>{nome}</b>
                      <Button variant="ghost" onClick={() => adicionar(dia)}>Adicionar horário{" "}<span className="sr-only">em {nome}</span></Button>
                    </div>
                    {intervalos.map((item, indice) => item.dia === dia && (
                      <div className="schedule__row" key={indice}>
                        <input type="time" value={item.inicio} onChange={(event) => mudar(indice, "inicio", event.target.value)} aria-label={`Início em ${nome}`} />
                        <span>até</span>
                        <input type="time" value={item.fim} onChange={(event) => mudar(indice, "fim", event.target.value)} aria-label={`Fim em ${nome}`} />
                        <Button variant="link" onClick={() => remover(indice)}>Remover</Button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Button type="submit" className="btn--full" disabled={enviando}>{enviando ? "Salvando..." : "Salvar agenda"}</Button>
            </form>
          </DialogPanel>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaAgenda;
