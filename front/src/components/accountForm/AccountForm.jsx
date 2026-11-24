import { useState } from 'react';
import Button from '../button/Button';
import DialogPanel from '../dialogPanel/DialogPanel';
import Input from '../input/Input';
import Message from '../message/Message';
import PasswordRulesChecklist from '../passwordRulesChecklist/PasswordRulesChecklist';
import { useAuth } from '../../context/AuthContext';
import { api, errosPorCampo } from '../../services/api';

// RF01: corrigir nome e nickname e, se quiser, trocar a senha. O e-mail identifica a conta e não muda.
function AccountForm({ onFechar }) {
  const { usuario, setUsuario } = useAuth();
  const [form, setForm] = useState({ nome: usuario.nome, nickname: usuario.nickname ?? "", senha_atual: "", senha: "", senha_confirmation: "" });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [revelar, setRevelar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const update = (key) => (value) => setForm({ ...form, [key]: value });
  const senhaProps = { type: "password", reveal: revelar, onReveal: () => setRevelar(!revelar) };

  const salvar = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setErrors({});
    setFeedback(null);
    const dados = { nome: form.nome.trim(), nickname: form.nickname.trim() };
    const senhas = { senha_atual: form.senha_atual, senha: form.senha, senha_confirmation: form.senha_confirmation };
    try {
      const data = await api("/me", { method: "PUT", body: form.senha ? { ...dados, ...senhas } : dados });
      setUsuario(data.usuario);
      setForm({ ...form, senha_atual: "", senha: "", senha_confirmation: "" });
      setFeedback({ kind: "success", text: data.message });
    } catch (err) {
      const campos = errosPorCampo(err);
      setErrors(campos);
      setFeedback({ kind: "error", text: Object.keys(campos).length ? "Confira os campos destacados." : err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <DialogPanel>
      <p className="eyebrow">EDITAR DADOS</p>
      <h2>Dados da conta</h2>
      <form onSubmit={salvar} className="offer-form">
        {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
        <Input label="Nome" value={form.nome} onChange={update("nome")} error={errors.nome} autoComplete="name" />
        <Input label="Nickname" value={form.nickname} onChange={update("nickname")} error={errors.nickname} autoComplete="nickname" />
        <Input label="Nova senha (opcional)" value={form.senha} onChange={update("senha")} error={errors.senha} autoComplete="new-password" {...senhaProps} />
        {form.senha && (
          <>
            <PasswordRulesChecklist password={form.senha} />
            <Input label="Confirmar nova senha" value={form.senha_confirmation} onChange={update("senha_confirmation")} autoComplete="new-password" {...senhaProps} />
            <Input label="Senha atual" value={form.senha_atual} onChange={update("senha_atual")} error={errors.senha_atual} autoComplete="current-password" {...senhaProps} />
          </>
        )}
        <Button type="submit" className="btn--full" disabled={enviando}>{enviando ? "Salvando..." : "Salvar dados"}</Button>
        <Button variant="ghost" className="btn--full" onClick={onFechar}>Fechar</Button>
      </form>
    </DialogPanel>
  );
}

export default AccountForm;
