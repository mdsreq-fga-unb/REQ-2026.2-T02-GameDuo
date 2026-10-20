import './RecoveryChannelPicker.css';

const channels = [
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
];

// value: "email" | "phone"
function RecoveryChannelPicker({ value, onChange }) {
  return (
    <div className="rpg-options" role="radiogroup" aria-label="Canal de recuperação">
      {channels.map((channel) => {
        const active = value === channel.value;
        return (
          <button key={channel.value} role="radio" aria-checked={active} className={active ? "active" : ""} onClick={() => onChange(channel.value)}>
            <i>►</i><span>{channel.label}</span><b />
          </button>
        );
      })}
    </div>
  );
}

export default RecoveryChannelPicker;
