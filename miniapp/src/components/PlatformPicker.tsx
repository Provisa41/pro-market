import { PLATFORMS, type Platform } from "../types/campaign";

type Props = {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
};

export default function PlatformPicker({ selected, onChange }: Props) {
  const toggle = (id: Platform) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="platforms">
      <p className="platforms__title">Где публикуем</p>
      <div className="platforms__grid">
        {PLATFORMS.map((p) => {
          const active = selected.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className={`platform-chip${active ? " platform-chip--on" : ""}`}
              onClick={() => toggle(p.id)}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
