import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaCarteira.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import EmptyState from '../../components/emptyState/EmptyState';
import Message from '../../components/message/Message';
import { api } from '../../services/api';
import { formatarDataHora, formatarMoedas, tiposMovimento } from '../../utils/moedas';
import { useContagem } from '../../utils/useContagem';

function PaginaCarteira() {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(null);
  const [movimentos, setMovimentos] = useState(null);
  const [error, setError] = useState("");
  const saldoAnimado = useContagem(saldo);

  useEffect(() => {
    Promise.all([api("/carteira"), api("/carteira/extrato")])
      .then(([carteira, extrato]) => {
        setSaldo(carteira.saldo);
        setMovimentos(extrato.movimentos);
      })
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login", { replace: true, state: { voltarPara: "/carteira" } });
          return;
        }
        setError(err.message);
      });
  }, [navigate]);

  const carregando = saldo === null && !error;

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/")}>← Voltar ao catálogo</Button>
        <div className="wallet-title">
          <p className="eyebrow">INVENTÁRIO</p>
          <h1>Minha carteira</h1>
          <p className="detail-copy">Use suas moedas para contratar coaching e duos no catálogo.</p>
        </div>

        {error && <Message kind="error">{error}</Message>}
        {carregando && <Message kind="info">Carregando sua carteira...</Message>}

        {saldo !== null && (
          <div className="wallet-grid">
            <DialogPanel>
              <div className="wallet-balance">
                <div className="coin-stack" aria-hidden="true"><i /><i /><i /></div>
                <p className="wallet-balance__label">Saldo disponível</p>
                <p className="wallet-balance__value"><strong>{formatarMoedas(saldoAnimado)}</strong> <span>moedas</span></p>
                <p className="wallet-balance__rate">1 moeda = R$ 1,00</p>
                <Button className="btn--full" onClick={() => navigate("/comprar-moedas")}>Comprar moedas</Button>
              </div>
            </DialogPanel>

            <section className="wallet-history" aria-labelledby="extrato-titulo">
              <header className="wallet-history__head">
                <h2 id="extrato-titulo">Extrato</h2>
                <span>{movimentos.length} {movimentos.length === 1 ? "movimento" : "movimentos"}</span>
              </header>

              {movimentos.length === 0 ? (
                <EmptyState title="Nenhuma movimentação ainda" text="Suas compras e contratações vão aparecer aqui." />
              ) : (
                <ol className="wallet-list stagger">
                  {movimentos.map((movimento) => {
                    const tipo = tiposMovimento[movimento.tipo] ?? { rotulo: movimento.tipo, tom: "entrada" };
                    const positivo = movimento.moedas >= 0;
                    return (
                      <li key={movimento.id} className={`wallet-item wallet-item--${tipo.tom}`}>
                        <span className="wallet-item__tag">{tipo.rotulo}</span>
                        <div className="wallet-item__info">
                          <p>{movimento.tipo === "compra" ? `Compra de ${formatarMoedas(movimento.moedas)} moedas` : movimento.descricao}</p>
                          <time dateTime={movimento.data}>{formatarDataHora(movimento.data)}</time>
                        </div>
                        <strong className={positivo ? "is-positive" : "is-negative"}>
                          {positivo ? "+" : "−"}{formatarMoedas(Math.abs(movimento.moedas))}
                        </strong>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaCarteira;
