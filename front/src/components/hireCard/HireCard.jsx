import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HireCard.css';
import Button from '../button/Button';
import Input from '../input/Input';
import Message from '../message/Message';
import Modal from '../modal/Modal';
import { useAuth } from '../../context/AuthContext';
import { api, errosPorCampo } from '../../services/api';
import { avisarCarteiraAtualizada } from '../../utils/moedas';
import { agruparPorDia, formatarHora, formatarSessao } from '../../utils/sessoes';

// RF15 e RF16: o visitante vê os horários; para contratar precisa entrar (RN02).
function HireCard({ offer }) {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  const [vagas, setVagas] = useState(null);
  const [escolhida, setEscolhida] = useState(null);
  const [contato, setContato] = useState("");
  const [error, setError] = useState(null);
  const [erroContato, setErroContato] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(
    () => api(`/ofertas/${offer.id}/vagas`).then((data) => setVagas(data.vagas)).catch(setError),
    [offer.id],
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  const continuar = () => {
    setError(null);
    if (!contato.trim()) {
      setErroContato("Informe como o prestador pode falar com você.");
      return;
    }
    setErroContato("");
    setConfirmando(true);
  };

  const contratar = async () => {
    setEnviando(true);
    try {
      const data = await api("/contratacoes", {
        method: "POST",
        body: { oferta_id: offer.id, inicio: escolhida.inicio, contato: contato.trim(), preco: offer.price },
      });
      avisarCarteiraAtualizada();
      navigate("/contratacoes", { state: { success: data.message } });
    } catch (err) {
      setError(err);
      setErroContato(errosPorCampo(err).contato ?? "");
      // horário perdido para outra pessoa: mostra a lista atual
      if (err.status === 409) {
        setEscolhida(null);
        carregar();
      }
      setEnviando(false);
      setConfirmando(false);
    }
  };

  return (
    <div className="hire-card">
      <h3>Escolha um horário</h3>
      {error && <Message kind="error">{error.message}</Message>}
      {vagas === null && !error && <Message kind="info">Buscando horários...</Message>}
      {vagas?.length === 0 && <Message kind="info">Sem horários livres nos próximos dias. Volte depois ou escolha outra oferta.</Message>}
      {vagas?.length > 0 && (
        <div className="hire-card__days" tabIndex={0} role="group" aria-label="Horários livres, no horário de Brasília">
          {agruparPorDia(vagas).map((grupo) => (
            <div className="hire-card__day" key={grupo.dia}>
              <p>{grupo.dia}</p>
              <div className="hire-card__slots">
                {grupo.vagas.map((vaga) => (
                  <button type="button" key={vaga.inicio} aria-pressed={escolhida?.inicio === vaga.inicio} onClick={() => setEscolhida(vaga)}>
                    {formatarHora(vaga.inicio)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {loggedIn ? (
        vagas?.length > 0 && (
          <>
            <Input
              label="Seu contato"
              value={contato}
              onChange={setContato}
              placeholder={offer.communication ? `Ex.: seu usuário no ${offer.communication}` : "Ex.: seu usuário no Discord"}
              help="Só o prestador desta sessão vai ver."
              error={erroContato}
            />
            <Button className="btn--full" onClick={continuar} disabled={!escolhida}>Contratar agora</Button>
          </>
        )
      ) : (
        <>
          <Message kind="info">Entre na sua conta para contratar esta oferta.</Message>
          <Button className="btn--full" onClick={() => navigate("/login", { state: { voltarPara: `/oferta/${offer.id}` } })}>Entrar para contratar</Button>
        </>
      )}

      <Modal
        aberto={confirmando}
        titulo="Confirmar contratação?"
        confirmar="Contratar"
        cancelar="Voltar"
        carregando={enviando}
        onConfirmar={contratar}
        onCancelar={() => setConfirmando(false)}
      >
        <p><b>{offer.title}</b></p>
        {escolhida && <p>{formatarSessao(escolhida.inicio)}</p>}
        <p>{offer.price} moedas ficam reservadas até o fim da sessão. Você pode cancelar até o horário marcado.</p>
      </Modal>
    </div>
  );
}

export default HireCard;
