import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import Button from '../button/Button';
import DialogPanel from '../dialogPanel/DialogPanel';

const icones = { perigo: "!", sucesso: "✓", info: "i" };

function Modal({ aberto, tipo = "info", titulo, children, confirmar = "OK", cancelar, onConfirmar, onCancelar, carregando = false }) {
  const tituloId = useId();
  const botaoRef = useRef(null);
  const fechar = onCancelar ?? onConfirmar;
  const fecharRef = useRef(fechar);
  fecharRef.current = carregando ? null : fechar;

  useEffect(() => {
    if (!aberto) return undefined;
    const anterior = document.activeElement;
    const rolagem = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const botoes = botaoRef.current?.querySelectorAll("button");
    botoes?.[botoes.length - 1]?.focus();
    const tecla = (event) => {
      if (event.key === "Escape") fecharRef.current?.();
    };
    window.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = rolagem;
      window.removeEventListener("keydown", tecla);
      anterior?.focus?.();
    };
  }, [aberto]);

  if (!aberto) return null;

  return createPortal(
    <div className="modal" onMouseDown={(event) => event.target === event.currentTarget && !carregando && fechar?.()}>
      <div className={`modal__janela modal__janela--${tipo}`} role="dialog" aria-modal="true" aria-labelledby={tituloId}>
        <DialogPanel>
          <span className="modal__icone" aria-hidden="true">{icones[tipo]}</span>
          <h2 id={tituloId}>{titulo}</h2>
          <div className="modal__texto">{children}</div>
          <div className="modal__acoes" ref={botaoRef}>
            <Button variant={tipo === "perigo" ? "danger" : "primary"} onClick={onConfirmar} disabled={carregando}>
              {carregando ? "Aguarde..." : confirmar}
            </Button>
            {cancelar && <Button variant="ghost" onClick={onCancelar} disabled={carregando}>{cancelar}</Button>}
          </div>
        </DialogPanel>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
