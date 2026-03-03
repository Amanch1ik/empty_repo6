import { Shirt, PaintBucket, Footprints, MousePointer2 } from 'lucide-react';

interface ColorOption {
  name: string;
  value: string;
}

interface ColorGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  colors: ColorOption[];
}

interface ToggleItem {
  key: string;
  label: string;
}

interface ClothingPanelProps {
  colors: Record<string, string>;
  toggles: Record<string, boolean>;
  onColorChange: (key: string, color: string) => void;
  onToggle: (key: string) => void;
}

const colorGroups: ColorGroup[] = [
  {
    key: 'topColor',
    label: 'Top',
    icon: <Shirt size={16} strokeWidth={1.6} />,
    colors: [
      { name: 'Navy', value: '#1a1a40' },
      { name: 'Crimson', value: '#8b1a1a' },
      { name: 'Forest', value: '#1a3a1a' },
      { name: 'White', value: '#e8e8e8' },
    ],
  },
  {
    key: 'bottomColor',
    label: 'Pants',
    icon: <PaintBucket size={16} strokeWidth={1.6} />,
    colors: [
      { name: 'Purple', value: '#3d1a40' },
      { name: 'Black', value: '#111111' },
      { name: 'Olive', value: '#3a3a1a' },
      { name: 'Denim', value: '#1a2a4a' },
    ],
  },
  {
    key: 'shoeColor',
    label: 'Shoes',
    icon: <Footprints size={16} strokeWidth={1.6} />,
    colors: [
      { name: 'Default', value: '#2a1a3a' },
      { name: 'White', value: '#e0e0e0' },
      { name: 'Red', value: '#7a1a1a' },
      { name: 'Black', value: '#0a0a0a' },
    ],
  },
];

const toggleItems: ToggleItem[] = [
  { key: 'showJacket', label: 'Jacket' },
  { key: 'showHair', label: 'Hair' },
  { key: 'showGlasses', label: 'Glasses' },
];

export default function ClothingPanel({
  colors, toggles, onColorChange, onToggle,
}: ClothingPanelProps) {
  return (
    <aside className="controls-panel">
      {/* ── Toggle Section ──────────────────── */}
      <div className="panel-section">
        <span className="section-title">Wardrobe</span>
        <div className="toggle-row">
          {toggleItems.map((item) => {
            const active = toggles[item.key];
            return (
              <button
                key={item.key}
                className={`pill-btn${active ? ' active' : ''}`}
                onClick={() => onToggle(item.key)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel-divider" />

      {/* ── Color Section ───────────────────── */}
      {colorGroups.map((group) => (
        <div key={group.key} className="color-group">
          <div className="color-group-header">
            <div className="toggle-icon">{group.icon}</div>
            <span className="toggle-label">{group.label}</span>
          </div>
          <div className="color-swatches">
            {group.colors.map((c) => (
              <button
                key={c.value}
                className={`swatch${colors[group.key] === c.value ? ' active' : ''}`}
                style={{ backgroundColor: c.value }}
                onClick={() => onColorChange(group.key, c.value)}
                title={c.name}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="panel-hint">
        <MousePointer2 size={12} />
        <span>Drag to rotate</span>
      </div>
    </aside>
  );
}
