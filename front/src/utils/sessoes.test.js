import { describe, expect, it } from 'vitest';
import { agruparPorDia, formatarHora } from './sessoes';

describe('sessoes', () => {
  it('mostra o horário de Brasília', () => {
    expect(formatarHora("2026-11-24T12:00:00Z")).toBe("09:00");
  });

  it('agrupa pelo dia de Brasília, mesmo quando o UTC já virou', () => {
    const grupos = agruparPorDia([{ inicio: "2026-11-24T23:00:00Z" }, { inicio: "2026-11-25T01:00:00Z" }, { inicio: "2026-11-25T12:00:00Z" }]);
    expect(grupos.map((grupo) => grupo.vagas.length)).toEqual([2, 1]);
  });
});
