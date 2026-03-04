import { useState, useRef } from 'react'
import {
  Shirt, PaintBucket, Footprints, MousePointer2,
  Camera, Sparkles, Dumbbell, Briefcase, Flame,
  ChevronUp, ChevronDown,
} from 'lucide-react'
import { PRESETS, COLOR_OPTIONS, type Preset } from '../data/presets'

const PRESET_ICONS: Record<string, React.ReactNode> = {
  shirt: <Shirt size={20} strokeWidth={1.5} />,
  dumbbell: <Dumbbell size={20} strokeWidth={1.5} />,
  briefcase: <Briefcase size={20} strokeWidth={1.5} />,
  flame: <Flame size={20} strokeWidth={1.5} />,
}

const TOGGLES = [
  { key: 'showJacket', label: 'Куртка' },
  { key: 'showHair', label: 'Волосы' },
  { key: 'showGlasses', label: 'Очки' },
]

const COLOR_ICONS: Record<string, React.ReactNode> = {
  topColor: <Shirt size={14} strokeWidth={1.6} />,
  bottomColor: <PaintBucket size={14} strokeWidth={1.6} />,
  shoeColor: <Footprints size={14} strokeWidth={1.6} />,
}

const COLOR_LABELS: Record<string, string> = {
  topColor: 'Верх',
  bottomColor: 'Брюки',
  shoeColor: 'Обувь',
}

interface Props {
  colors: Record<string, string>
  toggles: Record<string, boolean>
  onColorChange: (key: string, val: string) => void
  onToggle: (key: string) => void
  onPreset: (p: Preset) => void
  onScreenshot: () => void
}

export default function ClothingPanel({
  colors, toggles, onColorChange, onToggle, onPreset, onScreenshot,
}: Props) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'wardrobe' | 'presets'>('wardrobe')
  const [pickerKey, setPickerKey] = useState<string | null>(null)
  const pickerRef = useRef<HTMLInputElement>(null)

  const openPicker = (key: string) => {
    setPickerKey(key)
    setTimeout(() => pickerRef.current?.click(), 50)
  }

  return (
    <div className="panel-wrapper">
      <button className={`panel-toggle-btn${open ? ' open' : ''}`} onClick={() => setOpen(v => !v)}>
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        <span>{open ? 'Скрыть' : 'Настроить'}</span>
      </button>

      <aside className={`controls-panel${open ? ' open' : ''}`}>
        <div className="panel-content">
          <div className="tab-row">
            <button className={`tab-btn${tab === 'wardrobe' ? ' active' : ''}`} onClick={() => setTab('wardrobe')}>
              Гардероб
            </button>
            <button className={`tab-btn${tab === 'presets' ? ' active' : ''}`} onClick={() => setTab('presets')}>
              <Sparkles size={13} /> Стили
            </button>
          </div>

          <div className="panel-divider" />

          {tab === 'wardrobe' ? (
            <>
              <div className="toggle-row">
                {TOGGLES.map(t => (
                  <button
                    key={t.key}
                    className={`pill-btn${toggles[t.key] ? ' active' : ''}`}
                    onClick={() => onToggle(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="panel-divider" />

              <div className="color-groups-row">
                {['topColor', 'bottomColor', 'shoeColor'].map(key => (
                  <div key={key} className="color-group">
                    <div className="color-group-header">
                      <div className="toggle-icon">{COLOR_ICONS[key]}</div>
                      <span className="toggle-label">{COLOR_LABELS[key]}</span>
                    </div>
                    <div className="color-swatches">
                      {COLOR_OPTIONS[key].map(c => (
                        <button
                          key={c.value}
                          className={`swatch${colors[key] === c.value ? ' active' : ''}`}
                          style={{ backgroundColor: c.value }}
                          onClick={() => onColorChange(key, c.value)}
                          title={c.name}
                        />
                      ))}
                      <button className="swatch swatch-custom" onClick={() => openPicker(key)} title="Свой цвет">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="presets-grid">
              {PRESETS.map(p => (
                <button key={p.name} className="preset-card" onClick={() => onPreset(p)}>
                  <span className="preset-icon">{PRESET_ICONS[p.icon]}</span>
                  <span className="preset-name">{p.name}</span>
                  <div className="preset-colors">
                    {Object.values(p.colors).map((c, i) => (
                      <span key={i} className="preset-dot" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="panel-divider" />

          <div className="actions-row">
            <button className="action-btn" onClick={onScreenshot}>
              <Camera size={14} />
              <span>Скриншот</span>
            </button>
            <div className="panel-hint">
              <MousePointer2 size={11} />
              <span>Вращайте</span>
            </div>
          </div>
        </div>

        <input
          ref={pickerRef}
          type="color"
          className="hidden-color-input"
          value={pickerKey ? colors[pickerKey] || '#fff' : '#fff'}
          onChange={e => { if (pickerKey) onColorChange(pickerKey, e.target.value) }}
        />
      </aside>
    </div>
  )
}
