import '../input/Input.css';
import './Select.css';

function Select({ label, value, options, onChange }) {
  return (
    <label className="field field--select">
      <span className="field__label">{label}</span>
      <span className="field__control">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </span>
    </label>
  );
}

export default Select;
