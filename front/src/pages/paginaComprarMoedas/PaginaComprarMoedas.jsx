import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaComprarMoedas.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import OrderSummary from '../../components/orderSummary/OrderSummary';
import PixelIcon from '../../components/pixelIcon/PixelIcon';
import { api, errosPorCampo } from '../../services/api';
import { onlyDigits } from '../../utils/validators';
import { formasPagamento, formatarMoedas, formatarReais, mascararCpf, pacotes } from '../../utils/moedas';

function PaginaComprarMoedas() {
  const navigate = useNavigate();
  const [pacoteId, setPacoteId] = useState("padrao");
  const [forma, setForma] = useState("pix");
  const [cpf, setCpf] = useState("");
  const [errors, setErrors] = useState({});
  const [falha, setFalha] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const cpfRef = useRef(null);

  useEffect(() => {
    if (!errors.cpf) return;
    cpfRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    cpfRef.current?.querySelector("input")?.focus({ preventScroll: true });
  }, [errors]);

  const pacote = pacotes.find((item) => item.id === pacoteId);
  const formaEscolhida = formasPagamento.find((item) => item.id === forma);

  const enviar = async (event) => {
    event.preventDefault();
    setFalha(null);

    const digitos = onlyDigits(cpf);
    if (digitos && digitos.length !== 11) {
      setErrors({ cpf: "O CPF deve ter 11 dígitos." });
      return;
    }

    setErrors({});
    setEnviando(true);
    try {
      const data = await api("/checkout", {
        method: "POST",
        body: { pacote: pacoteId, forma, ...(digitos ? { cpf: digitos } : {}) },
      });
      navigate(`/pagamento/${data.cobranca.id}`, { state: { cobranca: data.cobranca, pix: data.pix } });
    } catch (err) {
      if (err.status === 401) {
        navigate("/login", { replace: true, state: { voltarPara: "/comprar-moedas" } });
        return;
      }
      const campos = errosPorCampo(err);
      if (campos.cpf && !digitos) campos.cpf = "Informe seu CPF para continuar.";
      setErrors(campos);
      if (err.status !== 422) setFalha(err.message);
      setEnviando(false);
    }
  };

  return (
    <MainLayout>
      <main className="detail-main shop-main">
        <Button variant="ghost" onClick={() => navigate("/carteira")}>← Voltar à carteira</Button>
        <div className="shop-title">
          <p className="eyebrow">LOJA DE MOEDAS</p>
          <h1>Comprar moedas</h1>
          <p className="detail-copy">Escolha um pacote e a forma de pagamento. Suas moedas chegam assim que o pagamento for aprovado.</p>
        </div>

        <form className="shop-grid" onSubmit={enviar} noValidate>
          <div className="shop-steps stagger">
            <fieldset className="shop-step">
              <legend><span>1</span>Escolha o pacote</legend>
              <div className="pack-grid stagger">
                {pacotes.map((item) => (
                  <label key={item.id} className={`pack-card ${item.id === pacoteId ? "is-selected" : ""}`}>
                    <input type="radio" name="pacote" value={item.id} checked={item.id === pacoteId} onChange={() => setPacoteId(item.id)} />
                    <span className="pack-card__tier" aria-hidden="true">
                      {[1, 2, 3, 4].map((nivel) => <i key={nivel} className={nivel <= item.nivel ? "on" : ""} />)}
                    </span>
                    <span className="pack-card__name">{item.nome}</span>
                    <span className="pack-card__coins"><PixelIcon type="coin" /> {formatarMoedas(item.moedas)}</span>
                    <span className="pack-card__price">{formatarReais(item.valor)}</span>
                  </label>
                ))}
              </div>
              {errors.pacote && <p className="shop-error">{errors.pacote}</p>}
            </fieldset>

            <fieldset className="shop-step">
              <legend><span>2</span>Forma de pagamento</legend>
              <div className="pay-grid">
                {formasPagamento.map((item) => (
                  <label key={item.id} className={`pay-card ${item.id === forma ? "is-selected" : ""}`}>
                    <input type="radio" name="forma" value={item.id} checked={item.id === forma} onChange={() => setForma(item.id)} />
                    <span className="pay-card__icon"><PixelIcon type={item.icone} /></span>
                    <span className="pay-card__text">
                      <b>{item.nome}</b>
                      <small>{item.descricao}</small>
                    </span>
                  </label>
                ))}
              </div>
              {errors.forma && <p className="shop-error">{errors.forma}</p>}
            </fieldset>

            <fieldset className="shop-step" ref={cpfRef}>
              <legend><span>3</span>Seus dados</legend>
              <Input
                label="CPF"
                name="cpf"
                value={cpf}
                onChange={(valor) => setCpf(mascararCpf(valor))}
                placeholder="000.000.000-00"
                autoComplete="off"
                help="Precisamos do seu CPF para gerar o pagamento."
                error={errors.cpf}
              />
            </fieldset>
          </div>

          <aside className="shop-summary">
            <DialogPanel>
              <p className="eyebrow">RESUMO DA COMPRA</p>
              <OrderSummary
                itens={[
                  { rotulo: "Pacote", valor: pacote.nome },
                  { rotulo: "Moedas", valor: formatarMoedas(pacote.moedas), moeda: true },
                  { rotulo: "Pagamento", valor: formaEscolhida.nome },
                ]}
                total={formatarReais(pacote.valor)}
                nota="Pagamento seguro. Não guardamos os dados do seu cartão."
              >
                {falha && <Message kind="error">{falha}</Message>}
                <Button type="submit" className="btn--full" disabled={enviando}>
                  {enviando ? "Preparando pagamento..." : forma === "pix" ? "Gerar Pix" : "Continuar"}
                </Button>
              </OrderSummary>
            </DialogPanel>
          </aside>
        </form>
      </main>
    </MainLayout>
  );
}

export default PaginaComprarMoedas;
