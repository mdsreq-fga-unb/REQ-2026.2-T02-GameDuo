import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useContagem } from './useContagem';

describe('useContagem', () => {
  it('fica em zero enquanto não há valor', () => {
    const { result } = renderHook(() => useContagem(null));
    expect(result.current).toBe(0);
  });

  it('mostra o valor final na hora quando o usuário prefere menos movimento', () => {
    const { result } = renderHook(() => useContagem(300));
    expect(result.current).toBe(300);
  });

  it('conta até o valor e não anima de novo quando o valor se repete', () => {
    window.matchMedia = vi.fn(() => ({ matches: false }));
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    const { result, rerender } = renderHook(({ alvo }) => useContagem(alvo, 100), { initialProps: { alvo: 50 } });

    act(() => vi.advanceTimersByTime(48));
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(50);

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(50);

    rerender({ alvo: 50 });
    expect(result.current).toBe(50);
  });

  it('cancela a animação ao sair da tela', () => {
    window.matchMedia = vi.fn(() => ({ matches: false }));
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    const cancelar = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = renderHook(() => useContagem(80));
    unmount();
    expect(cancelar).toHaveBeenCalled();
  });
});
