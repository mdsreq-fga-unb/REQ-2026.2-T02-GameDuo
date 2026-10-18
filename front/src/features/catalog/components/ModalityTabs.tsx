import { PixelIcon, type PixelIconType } from "@/components/ui";
import type { Modality } from "@/types";

const tabs: { value: Modality; label: string; icon: PixelIconType }[] = [
  { value: "Coaching", label: "Coaching", icon: "shield" },
  { value: "Duo", label: "Duos", icon: "people" },
];

type ModalityTabsProps = {
  value: Modality | "";
  onChange: (value: Modality) => void;
};

export function ModalityTabs({ value, onChange }: ModalityTabsProps) {
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
