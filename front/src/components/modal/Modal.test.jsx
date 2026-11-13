import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  it('não aparece quando está fechado', () => {
    render(<Modal aberto={false} titulo="Oi" onConfirmar={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it('confirma, cancela e fecha com ESC ou clique fora', () => {
    const onConfirmar = vi.fn();
    const onCancelar = vi.fn();
    render(
      <Modal aberto tipo="perigo" titulo="Excluir?" confirmar="Excluir" cancelar="Manter" onConfirmar={onConfirmar} onCancelar={onCancelar}>
        <p>Texto</p>
      </Modal>,
    );

    expect(screen.getByRole("dialog", { name: "Excluir?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Excluir" })).toHaveClass("btn--danger");
    expect(screen.getByRole("button", { name: "Manter" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));
    expect(onConfirmar).toHaveBeenCalledOnce();

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.mouseDown(screen.getByText("Texto"));
    fireEvent.mouseDown(document.querySelector(".modal"));
    expect(onCancelar).toHaveBeenCalledTimes(2);
  });

  it('sem botão de cancelar, fechar usa a confirmação', () => {
    const onConfirmar = vi.fn();
    render(<Modal aberto titulo="Aviso" onConfirmar={onConfirmar} />);
    expect(screen.getByRole("button", { name: "OK" })).toHaveClass("btn--primary");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onConfirmar).toHaveBeenCalledOnce();
  });

  it('bloqueia ações enquanto carrega e devolve o foco ao fechar', () => {
    const onCancelar = vi.fn();
    const gatilho = document.createElement("button");
    document.body.appendChild(gatilho);
    gatilho.focus();

    const { rerender } = render(<Modal aberto carregando titulo="Saindo" cancelar="Voltar" onConfirmar={vi.fn()} onCancelar={onCancelar} />);
    expect(screen.getByRole("button", { name: "Aguarde..." })).toBeDisabled();
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.mouseDown(document.querySelector(".modal"));
    expect(onCancelar).not.toHaveBeenCalled();

    rerender(<Modal aberto={false} titulo="Saindo" onConfirmar={vi.fn()} />);
    expect(gatilho).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    gatilho.remove();
  });
});
