export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <button className={`logo ${compact ? "logo--compact" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="GameDuo, início">
      <span className="logo-mark"><i /><i /></span>
      <span>Game<span>Duo</span></span>
    </button>
  );
}
