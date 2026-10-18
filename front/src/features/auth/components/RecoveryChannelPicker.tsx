export type RecoveryChannel = "email" | "phone";

const channels: { value: RecoveryChannel; label: string }[] = [
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
];

type RecoveryChannelPickerProps = {
  value: RecoveryChannel;
  onChange: (channel: RecoveryChannel) => void;
};

export function RecoveryChannelPicker({ value, onChange }: RecoveryChannelPickerProps) {
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
