import { describe, expect, it, vi } from 'vitest';
import {
  EVENTO_CARTEIRA,
  avisarCarteiraAtualizada,
  formatarData,
  formatarDataHora,
  formatarMoedas,
  formatarReais,
  mascararCpf,
  nomeForma,
  nomePacote,
} from './moedas';

describe('moedas', () => {
  it('traduz pacote e forma de pagamento', () => {
    expect(nomePacote("plus")).toBe("Plus");
    expect(nomePacote("outro")).toBe("outro");
    expect(nomeForma("cartao")).toBe("Cartão");
    expect(nomeForma("boleto")).toBe("boleto");
  });

  it('formata reais e moedas', () => {
    expect(formatarReais("100.00")).toMatch(/R\$\s100,00/);
    expect(formatarReais("abc")).toBe("—");
    expect(formatarMoedas(1500)).toBe("1.500");
    expect(formatarMoedas(undefined)).toBe("0");
  });

  it('formata datas e trata valores inválidos', () => {
    expect(formatarData("2026-11-12 10:30:00")).toBe("12/11/2026");
    expect(formatarData(new Date(2026, 0, 5))).toBe("05/01/2026");
    expect(formatarData(null)).toBe("—");
    expect(formatarDataHora("2026-11-12T10:30:00")).toMatch(/12\/11\/2026.*10:30/);
    expect(formatarDataHora("data ruim")).toBe("—");
  });

  it('mascara o CPF enquanto digita', () => {
    expect(mascararCpf("123")).toBe("123");
    expect(mascararCpf("1234")).toBe("123.4");
    expect(mascararCpf("1234567")).toBe("123.456.7");
    expect(mascararCpf("123456789012345")).toBe("123.456.789-01");
  });

  it('avisa que a carteira mudou', () => {
    const ouvinte = vi.fn();
    window.addEventListener(EVENTO_CARTEIRA, ouvinte);
    avisarCarteiraAtualizada();
    window.removeEventListener(EVENTO_CARTEIRA, ouvinte);
    expect(ouvinte).toHaveBeenCalledOnce();
  });
});
