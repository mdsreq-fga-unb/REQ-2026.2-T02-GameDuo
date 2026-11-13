import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OrderSummary from './OrderSummary';

describe('OrderSummary', () => {
  it('mostra itens, total, conteúdo extra e nota', () => {
    const { container } = render(
      <OrderSummary itens={[{ rotulo: "Pacote", valor: "Plus" }, { rotulo: "Moedas", valor: "250", moeda: true }]} total="R$ 250,00" nota="Pagamento seguro.">
        <button type="button">Pagar</button>
      </OrderSummary>,
    );
    expect(screen.getByText("Plus")).toBeInTheDocument();
    expect(screen.getByText("R$ 250,00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pagar" })).toBeInTheDocument();
    expect(screen.getByText(/Pagamento seguro/)).toBeInTheDocument();
    expect(container.querySelectorAll("dd .pixel-icon")).toHaveLength(1);
  });

  it('não mostra nota quando não recebe uma', () => {
    const { container } = render(<OrderSummary itens={[]} total="R$ 0,00" />);
    expect(container.querySelector(".order-summary__note")).toBeNull();
  });
});
