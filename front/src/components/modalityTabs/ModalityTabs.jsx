import './ModalityTabs.css';
import PixelIcon from '../pixelIcon/PixelIcon';

const tabs = [
  { value: "Coaching", label: "Coaching", icon: "shield" },
  { value: "Duo", label: "Duos", icon: "people" },
];

// value: "Coaching" | "Duo" | "" (nenhuma aba escolhida)
function ModalityTabs({ value, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Modalidade">
      {tabs.map((tab) => (
        <button key={tab.value} className={value === tab.value ? "active" : ""} onClick={() => onChange(tab.value)} role="tab" aria-selected={value === tab.value}>
          <PixelIcon type={tab.icon} /><span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ModalityTabs;
