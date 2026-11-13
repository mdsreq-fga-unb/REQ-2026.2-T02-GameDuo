import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './PaginaPagamento.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Message from '../../components/message/Message';
import OrderSummary from '../../components/orderSummary/OrderSummary';
import PixelIcon from '../../components/pixelIcon/PixelIcon';
import { api } from '../../services/api';
import {
  avisarCarteiraAtualizada,
  formatarDataHora,
  formatarMoedas,
  formatarReais,
  nomeForma,
  nomePacote,
  statusCobranca,
} from '../../utils/moedas';
import { useContagem } from '../../utils/useContagem';

const INTERVALO_CONSULTA = 5000;

const faiscas = [
  [-70, -60], [70, -64], [-92, 4], [94, 0], [-60, 64], [62, 66], [0, -92], [0, 90], [-30, -84], [32, 84],
];

const titulos = {
  pix: "Pague com Pix",
  cartao: "Pague com cartão",
  paga: "Moedas na conta!",
  encerrada: "Pedido não concluído",
};

function StatusBadge({ status }) {
  const info = statusCobranca[status] ?? { rotulo: status, tom: "pendente" };
  return <span className={`pay-status pay-status--${info.tom}`}><i aria-hidden="true" />{info.rotulo}</span>;
}

function Conferindo({ onVerificar, verificando }) {
  return (
    <div className="pay-watch">
      <p role="status"><span className="pay-watch__dots" aria-hidden="true"><i /><i /><i /></span> Aguardando a confirmação do pagamento...</p>
      <Button variant="secondary" onClick={onVerificar} disabled={verificando}>{verificando ? "Verificando..." : "Já paguei"}</Button>
    </div>
  );
}

function PainelPix({ pix, codigo, onVerificar, verificando }) {
  const campoRef = useRef(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return undefined;
    const timer = setTimeout(() => setCopiado(false), 2500);
    return () => clearTimeout(timer);
  }, [copiado]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      campoRef.current?.select();
      document.execCommand("copy");
    }
    setCopiado(true);
  };

  return (
    <div className="pay-pix">
      <div className="pay-qr">
        {pix?.qrcode ? (
          <img src={`data:image/png;base64,${pix.qrcode}`} alt="QR Code Pix para pagamento" width="220" height="220" />
        ) : (
          <p>Use o código copia e cola abaixo para pagar.</p>
        )}
      </div>
      <ol className="pay-steps">
        <li><span>Abra o app do seu banco e escolha <b>Pix</b>.</span></li>
        <li><span>Escaneie o QR Code ou cole o código abaixo.</span></li>
        <li><span>Confirme o pagamento e pronto.</span></li>
      </ol>
      {codigo && (
        <div className="pay-code">
          <label htmlFor="pix-copia-cola">Pix copia e cola</label>
          <div className="pay-code__row">
            <input id="pix-copia-cola" ref={campoRef} value={codigo} readOnly onFocus={(event) => event.target.select()} />
            <Button onClick={copiar} className={copiado ? "is-done" : ""}><PixelIcon type="copy" /> {copiado ? "Copiado!" : "Copiar"}</Button>
          </div>
          {pix?.expira_em && <small>Válido até {formatarDataHora(pix.expira_em)}</small>}
        </div>
      )}
      <Conferindo onVerificar={onVerificar} verificando={verificando} />
    </div>
  );
}

function PainelCartao({ link, onVerificar, verificando }) {
  return (
    <div className="pay-card-flow">
      <div className="pay-card-art" aria-hidden="true"><span /><i /></div>
      <p>Toque no botão abaixo para informar os dados do cartão com segurança. Depois é só voltar aqui.</p>
      {link ? (
        <a className="btn btn--primary btn--full" href={link} target="_blank" rel="noopener noreferrer">Pagar com cartão ↗</a>
      ) : (
        <Message kind="error">Não foi possível abrir o pagamento. Tente fazer a compra de novo.</Message>
      )}
      <Conferindo onVerificar={onVerificar} verificando={verificando} />
    </div>
  );
}

function PainelPago({ cobranca, saldo, navigate }) {
  const ganho = useContagem(cobranca.moedas, 900);

  return (
    <div className="pay-done">
      <div className="pay-burst" aria-hidden="true">
        <i />
        {faiscas.map(([x, y], indice) => <b key={indice} style={{ "--x": `${x}px`, "--y": `${y}px`, "--atraso": `${indice * 0.03}s` }} />)}
      </div>
      <p className="pay-done__gain">+{formatarMoedas(ganho)} <span>moedas</span></p>
      <p className="detail-copy">Pagamento confirmado em {formatarDataHora(cobranca.pago_em)}.</p>
      {saldo !== null && <p className="pay-done__balance">Saldo atual: <b>{formatarMoedas(saldo)} moedas</b></p>}
      <div className="pay-actions">
        <Button onClick={() => navigate("/")}>Explorar ofertas</Button>
        <Button variant="secondary" onClick={() => navigate("/carteira")}>Ver carteira</Button>
      </div>
    </div>
  );
}

function PainelEncerrado({ status, navigate }) {
  return (
    <div className="pay-closed">
      <Message kind="error">
        {status === "vencida" ? "O tempo para pagar acabou." : "Este pedido foi cancelado."} Você não foi cobrado.
      </Message>
      <div className="pay-actions">
        <Button onClick={() => navigate("/comprar-moedas")}>Fazer nova compra</Button>
        <Button variant="secondary" onClick={() => navigate("/carteira")}>Ver carteira</Button>
      </div>
    </div>
  );
}

function PaginaPagamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [cobranca, setCobranca] = useState(location.state?.cobranca ?? null);
  const [pix] = useState(location.state?.pix ?? null);
  const [saldo, setSaldo] = useState(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [verificando, setVerificando] = useState(false);

  const consultar = useCallback(async () => {
    try {
      const data = await api(`/checkout/${id}`);
      setCobranca(data.cobranca);
      setAviso("");
    } catch (err) {
      if (err.status === 401) {
        navigate("/login", { replace: true, state: { voltarPara: `/pagamento/${id}` } });
        return;
      }
      if (err.status === 404) {
        setErro("Não encontramos este pedido.");
        return;
      }
      setAviso(err.message);
    }
  }, [id, navigate]);

  useEffect(() => {
    consultar();
  }, [consultar]);

  const status = cobranca?.status;

  useEffect(() => {
    if (status !== "pendente") return undefined;
    const timer = setInterval(consultar, INTERVALO_CONSULTA);
    window.addEventListener("focus", consultar);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", consultar);
    };
  }, [status, consultar]);

  useEffect(() => {
    if (status !== "paga") return;
    avisarCarteiraAtualizada();
    api("/carteira").then((data) => setSaldo(data.saldo)).catch(() => {});
  }, [status]);

  const verificarAgora = async () => {
    setVerificando(true);
    await consultar();
    setVerificando(false);
  };

  const encerrada = status === "vencida" || status === "cancelada";
  const titulo = status === "paga" ? titulos.paga : encerrada ? titulos.encerrada : titulos[cobranca?.forma] ?? "Pagamento";
  const codigoPix = pix?.copia_cola ?? cobranca?.pix_copia_cola;

  return (
    <MainLayout>
      <main className="detail-main pay-main">
        <Button variant="ghost" onClick={() => navigate("/carteira")}>← Voltar à carteira</Button>

        {erro && (
          <div className="pay-missing">
            <Message kind="error">{erro}</Message>
            <Button onClick={() => navigate("/comprar-moedas")}>Comprar moedas</Button>
          </div>
        )}
        {!erro && !cobranca && <Message kind="info">Carregando seu pedido...</Message>}

        {!erro && cobranca && (
          <>
            <div className="pay-title">
              <p className="eyebrow">PEDIDO #{cobranca.id}</p>
              <h1>{titulo}</h1>
            </div>
            {aviso && <Message kind="info">{aviso}</Message>}

            <div className="pay-grid">
              <DialogPanel>
                <StatusBadge status={status} />
                {status === "pendente" && cobranca.forma === "pix" && (
                  <PainelPix pix={pix} codigo={codigoPix} onVerificar={verificarAgora} verificando={verificando} />
                )}
                {status === "pendente" && cobranca.forma === "cartao" && (
                  <PainelCartao link={cobranca.link_pagamento} onVerificar={verificarAgora} verificando={verificando} />
                )}
                {status === "paga" && <PainelPago cobranca={cobranca} saldo={saldo} navigate={navigate} />}
                {encerrada && <PainelEncerrado status={status} navigate={navigate} />}
              </DialogPanel>

              <aside className="pay-order">
                <h2>Seu pedido</h2>
                <OrderSummary
                  itens={[
                    { rotulo: "Pacote", valor: nomePacote(cobranca.pacote) },
                    { rotulo: "Moedas", valor: formatarMoedas(cobranca.moedas), moeda: true },
                    { rotulo: "Pagamento", valor: nomeForma(cobranca.forma) },
                    { rotulo: "Criado em", valor: formatarDataHora(cobranca.criada_em) },
                  ]}
                  total={formatarReais(cobranca.valor)}
                  nota={status === "pendente" ? "Pode fechar esta tela se quiser: suas moedas chegam do mesmo jeito." : null}
                />
              </aside>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaPagamento;
