import './CheckGroup.css';
import '../input/Input.css';

// values: lista com as opções marcadas
function CheckGroup({ label, options, values, onChange, error }) {
  const alternar = (opcao) =>
    onChange(values.includes(opcao) ? values.filter((valor) => valor !== opcao) : [...values, opcao]);

  return (
    <fieldset className="check-group">
      <legend className="field__label">{label}</legend>
      <div className="check-group__options">
        {options.map((opcao) => (
          <label key={opcao}>
            <input type="checkbox" checked={values.includes(opcao)} onChange={() => alternar(opcao)} />
            {opcao}
          </label>
        ))}
      </div>
      {error && <span className="field__error" role="alert">{error}</span>}
    </fieldset>
  );
}

export default CheckGroup;
