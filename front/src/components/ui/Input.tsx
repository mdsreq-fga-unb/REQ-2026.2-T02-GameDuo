import { PixelIcon } from "./PixelIcon";

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
  help?: string;
  /** Apenas para type="password": exibe a senha em texto puro. */
  reveal?: boolean;
  onReveal?: () => void;
  name?: string;
  autoComplete?: string;
};

export function Input({ label, value, onChange, placeholder, type = "text", error, help, reveal, onReveal, name, autoComplete }: InputProps) {
  const isPassword = type === "password";

  return (
    <label className={`field ${error ? "field--error" : ""}`}>
      <span className="field__label">{label}</span>
      <span className="field__control">
        <input
          name={name}
          type={isPassword && reveal ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button type="button" className="eye-button" onClick={onReveal} aria-label={reveal ? "Ocultar senha" : "Mostrar senha"}>
            <PixelIcon type={reveal ? "eye-off" : "eye"} />
          </button>
        )}
      </span>
      {help && !error && <span className="field__help">{help}</span>}
      {error && <span className="field__error"><PixelIcon type="heart" /> {error}</span>}
    </label>
  );
}
