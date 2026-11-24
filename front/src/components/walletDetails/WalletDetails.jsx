import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WalletDetails.css';
import Button from '../button/Button';
import Input from '../input/Input';
import Message from '../message/Message';
import Modal from '../modal/Modal';
import { api, errosPorCampo } from '../../services/api';
import { formatarData, formatarDataHora, formatarMoedas, formatarReais } from '../../utils/moedas';
import { statusSaque } from '../../utils/sessoes';

function Cartao({ rotulo, valor, ajuda }) {
  return (
    <div className="wallet-details__card">
      <span>{rotulo}</span>
      <b>{valor}</b>
      <small>{ajuda}</small>
    </div>
  );
}

function Lista({ titulo, itens }) {
  if (itens.length === 0) return null;
  return (
    <>
      <h3>{titulo}</h3>
      <ul className="wallet-details__list">
        {itens.map((item) => (
          <li key={item.id}>
            <span>{item.texto}<small>{item.detalhe}</small></span>
            <b>{item.valor}</b>
          </li>
        ))}
      </ul>
    </>
  );
}

const previsao = (data) => (data ? `Liberação prevista até ${formatarDataHora(data)}` : "Em análise pela administração");

// carteira: resposta de GET /carteira · onAtualizar: recarrega a carteira depois do saque
function WalletDetails({ carteira, onAtualizar }) {
  const navigate = useNavigate();
  const { recebimentos } = carteira;
  const [saques, setSaques] = useState([]);
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const ehPrestador = Boolean(recebimentos);

  const carregarSaques = () => api("/saques").then((data) => setSaques(data.saques)).catch(() => {});

  useEffect(() => {
    if (ehPrestador) carregarSaques();
  }, [ehPrestador]);

  // aceita "1.234,50" e "1234.50"
  const numero = Number(valor.includes(",") ? valor.replace(/\./g, "").replace(",", ".") : valor);

  const pedir = (event) => {
    event.preventDefault();
    if (!valor.trim() || Number.isNaN(numero) || numero <= 0) setErro("Informe um valor em reais, como 25,50.");
    else if (numero < recebimentos.saque_minimo) setErro(`O valor mínimo é ${formatarReais(recebimentos.saque_minimo)}.`);
    else if (numero > recebimentos.disponivel) setErro("O valor é maior que o saldo disponível para saque.");
    else {
      setErro("");
      setFeedback(null);
      setConfirmando(true);
    }
  };

  const sacar = async () => {
    setEnviando(true);
    try {
      const data = await api("/saques", { method: "POST", body: { valor: numero } });
      setFeedback({ kind: "success", text: data.message });
      setValor("");
      carregarSaques();
      onAtualizar();
    } catch (err) {
      setErro(errosPorCampo(err).valor ?? "");
      setFeedback({ kind: "error", text: err.message });
    } finally {
      setEnviando(false);
      setConfirmando(false);
    }
  };

  return (
    <div className="wallet-details">
      <section className="wallet-history" aria-labelledby="situacao-titulo">
        <header className="wallet-history__head"><h2 id="situacao-titulo">Moedas em andamento</h2></header>
        <div className="wallet-details__cards">
          <Cartao rotulo="Retido" valor={`${formatarMoedas(carteira.retido)} moedas`} ajuda="Reservado em sessões contratadas" />
          <Cartao rotulo="Pendente" valor={`${formatarMoedas(carteira.pendente)} moedas`} ajuda="Compras aguardando pagamento" />
        </div>
        <Lista
          titulo="Retido em contratações"
          itens={(carteira.retidos ?? []).map((item) => ({ id: item.contratacao_id, texto: item.titulo, detalhe: previsao(item.liberacao_prevista), valor: formatarMoedas(item.moedas) }))}
        />
        <Lista
          titulo="Compras pendentes"
          itens={(carteira.pendentes ?? []).map((item) => ({ id: item.cobranca_id, texto: "Compra de moedas", detalhe: formatarDataHora(item.criada_em), valor: formatarMoedas(item.moedas) }))}
        />
      </section>

      {recebimentos && (
        <section className="wallet-history" aria-labelledby="recebimentos-titulo">
          <header className="wallet-history__head"><h2 id="recebimentos-titulo">Recebimentos como prestador</h2></header>
          <div className="wallet-details__cards">
            <Cartao rotulo="Disponível para saque" valor={formatarReais(recebimentos.disponivel)} ajuda={`Saque mínimo de ${formatarReais(recebimentos.saque_minimo)}`} />
            <Cartao rotulo="Em carência" valor={formatarReais(recebimentos.em_carencia)} ajuda="Liberado 30 dias após a conclusão" />
            <Cartao rotulo="Em saque" valor={formatarReais(recebimentos.em_saque)} ajuda="Transferências em andamento" />
            <Cartao rotulo="Sessões não concluídas" valor={formatarReais(recebimentos.a_receber)} ajuda="Sua parte, se forem concluídas" />
          </div>

          <form onSubmit={pedir}>
            {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
            {recebimentos.dados_completos ? (
              <>
                <Input label="Valor do saque (R$)" value={valor} onChange={setValor} placeholder="Ex.: 50,00" inputMode="decimal" error={erro} />
                <Button type="submit" disabled={recebimentos.disponivel <= 0}>Solicitar saque</Button>
              </>
            ) : (
              <>
                <Message kind="info">Complete a chave Pix e o CPF do titular para poder sacar.</Message>
                <Button variant="secondary" onClick={() => navigate("/perfil-prestador")}>Completar dados</Button>
              </>
            )}
          </form>

          <Lista
            titulo="Em carência"
            itens={recebimentos.carencias.map((item) => ({ id: item.contratacao_id, texto: item.titulo, detalhe: `Disponível em ${formatarData(item.disponivel_em)}`, valor: formatarReais(item.valor) }))}
          />
          <Lista
            titulo="Sessões não concluídas"
            itens={recebimentos.previstos.map((item) => ({ id: item.contratacao_id, texto: item.titulo, detalhe: previsao(item.conclusao_prevista), valor: formatarReais(item.valor) }))}
          />
          <Lista
            titulo="Saques"
            itens={saques.map((item) => ({ id: item.id, texto: statusSaque[item.status] ?? item.status, detalhe: [formatarDataHora(item.solicitado_em), item.motivo_falha].filter(Boolean).join(" · "), valor: formatarReais(item.valor) }))}
          />
        </section>
      )}

      <Modal
        aberto={confirmando}
        titulo="Solicitar saque?"
        confirmar="Solicitar saque"
        cancelar="Voltar"
        carregando={enviando}
        onConfirmar={sacar}
        onCancelar={() => setConfirmando(false)}
      >
        <p><b>{formatarReais(numero)}</b> serão transferidos para a sua chave Pix cadastrada.</p>
      </Modal>
    </div>
  );
}

export default WalletDetails;
