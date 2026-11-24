import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../paginaMinhasOfertas/PaginaMinhasOfertas.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import CheckGroup from '../../components/checkGroup/CheckGroup';
import DialogPanel from '../../components/dialogPanel/DialogPanel';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import Select from '../../components/select/Select';
import { useAuth } from '../../context/AuthContext';
import { api, errosPorCampo } from '../../services/api';
import { mascararCpf } from '../../utils/moedas';
import { formatos, idiomas, tiposChave } from '../../utils/sessoes';
import { useJogosAtivos } from '../../utils/useJogosAtivos';

const perfilVazio = { codigo: null, apresentacao: "", jogos: [], modalidades: [], formatos: [], idiomas: [] };
const recebimentoVazio = { tipo_chave: "CPF", dados: "", cpf_titular: "" };

const codigoDoTipo = (rotulo) => Object.keys(tiposChave).find((chave) => tiposChave[chave] === rotulo);

// Rota: /perfil-prestador — RF04 e RF05.
// Quem ainda não presta serviço preenche tudo e ativa; quem já presta edita cada parte.
function PaginaConfigPrestador() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();
  const [perfil, setPerfil] = useState(perfilVazio);
  const [recebimento, setRecebimento] = useState(recebimentoVazio);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [carregado, setCarregado] = useState(!usuario.prestador);
  const jogosAtivos = useJogosAtivos();
  // jogo desativado depois de escolhido continua na lista para poder ser desmarcado
  const jogos = [...new Set([...jogosAtivos, ...perfil.jogos.map((item) => item.jogo)])];

  useEffect(() => {
    // só ao abrir a página: depois de ativar, o que está na tela já é o que foi salvo
    if (!usuario.prestador) return;
    Promise.all([api("/prestador/perfil"), api("/prestador/recebimento")])
      .then(([dadosPerfil, dadosRecebimento]) => {
        setPerfil({ ...dadosPerfil.perfil, apresentacao: dadosPerfil.perfil.apresentacao ?? "" });
        setRecebimento({
          tipo_chave: dadosRecebimento.tipo_chave ?? "CPF",
          dados: dadosRecebimento.dados ?? "",
          cpf_titular: mascararCpf(dadosRecebimento.cpf_titular ?? ""),
        });
        setCarregado(true);
      })
      .catch((err) => setFeedback({ kind: "error", text: err.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mudarPerfil = (campo) => (valor) => setPerfil({ ...perfil, [campo]: valor });
  const mudarRecebimento = (campo) => (valor) => setRecebimento({ ...recebimento, [campo]: valor });
  const mudarJogos = (nomes) =>
    mudarPerfil("jogos")(nomes.map((jogo) => perfil.jogos.find((item) => item.jogo === jogo) ?? { jogo, nivel: "" }));

  const enviar = async (caminho, method, body) => {
    setEnviando(true);
    setErrors({});
    setFeedback(null);
    try {
      const data = await api(caminho, { method, body });
      if (data.usuario) setUsuario(data.usuario);
      if (data.perfil) setPerfil(data.perfil);
      setFeedback({ kind: "success", text: data.message });
    } catch (err) {
      const campos = errosPorCampo(err);
      setErrors(campos);
      setFeedback({ kind: "error", text: Object.keys(campos).length ? "Confira os campos destacados." : err.message });
    } finally {
      setEnviando(false);
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  };

  const { codigo, ...dadosPerfil } = perfil;
  const salvarPerfil = (event) => {
    event.preventDefault();
    enviar("/prestador/perfil", "PUT", dadosPerfil);
  };
  const salvarRecebimento = (event) => {
    event.preventDefault();
    if (usuario.prestador) enviar("/prestador/recebimento", "PUT", recebimento);
    else enviar("/prestador", "POST", { ...dadosPerfil, ...recebimento });
  };

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/minha-conta")}>← Voltar para minha conta</Button>
        <div className="account-title">
          <p className="eyebrow">MODO PRESTADOR</p>
          <h1>{usuario.prestador ? "Perfil de prestador" : "Ativar perfil de prestador"}</h1>
        </div>
        {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
        {!carregado && !feedback && <Message kind="info">Carregando perfil...</Message>}
        {carregado && (
          <div className="detail-grid">
            <DialogPanel>
              <h2>Perfil público</h2>
              <form onSubmit={salvarPerfil} className="offer-form">
                <Input label="Apresentação" value={perfil.apresentacao} onChange={mudarPerfil("apresentacao")} multiline placeholder="Conte sua experiência e como você atende" error={errors.apresentacao} />
                <CheckGroup label="Jogos" options={jogos} values={perfil.jogos.map((item) => item.jogo)} onChange={mudarJogos} error={errors.jogos} />
                {perfil.jogos.map((item, indice) => (
                  <Input
                    key={item.jogo}
                    label={`Seu nível em ${item.jogo}`}
                    value={item.nivel}
                    onChange={(nivel) => mudarPerfil("jogos")(perfil.jogos.map((outro, i) => (i === indice ? { ...outro, nivel } : outro)))}
                    placeholder="Ex.: Diamante I"
                    help="Declarado por você; a plataforma não verifica."
                    error={errors[`jogos.${indice}.nivel`] ?? errors[`jogos.${indice}.jogo`]}
                  />
                ))}
                <CheckGroup label="Modalidades" options={["Coaching", "Duo"]} values={perfil.modalidades} onChange={mudarPerfil("modalidades")} error={errors.modalidades} />
                <CheckGroup label="Formatos de atendimento" options={formatos} values={perfil.formatos} onChange={mudarPerfil("formatos")} error={errors.formatos} />
                <CheckGroup label="Idiomas" options={idiomas} values={perfil.idiomas} onChange={mudarPerfil("idiomas")} error={errors.idiomas} />
                {usuario.prestador && (
                  <>
                    <Button type="submit" className="btn--full" disabled={enviando}>Salvar perfil</Button>
                    {codigo && <Button variant="ghost" className="btn--full" onClick={() => navigate(`/prestador/${codigo}`)}>Ver perfil público</Button>}
                  </>
                )}
              </form>
            </DialogPanel>
            <DialogPanel>
              <h2>Dados de recebimento</h2>
              <p className="detail-copy">Só você vê estes dados. Eles são usados para o saque por Pix.</p>
              <form onSubmit={salvarRecebimento} className="offer-form">
                <Select label="Tipo da chave Pix" value={tiposChave[recebimento.tipo_chave]} options={Object.values(tiposChave)} onChange={(rotulo) => mudarRecebimento("tipo_chave")(codigoDoTipo(rotulo))} />
                <Input label="Chave Pix" value={recebimento.dados} onChange={mudarRecebimento("dados")} error={errors.dados ?? errors.tipo_chave} />
                <Input label="CPF do titular" value={recebimento.cpf_titular} onChange={(valor) => mudarRecebimento("cpf_titular")(mascararCpf(valor))} placeholder="000.000.000-00" inputMode="numeric" error={errors.cpf_titular} />
                <Button type="submit" className="btn--full" disabled={enviando}>{usuario.prestador ? "Salvar dados" : "Ativar perfil de prestador"}</Button>
              </form>
            </DialogPanel>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaConfigPrestador;
