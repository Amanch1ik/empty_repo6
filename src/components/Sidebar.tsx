import { useState, useRef } from 'react'
import {
  Shirt, PaintBucket, Footprints, Sparkles, ChevronLeft, ChevronRight,
  User, Palette, ShoppingBag, Heart, Camera, X
} from 'lucide-react'
import { PRESETS, CHARACTER_PRESETS, COLOR_OPTIONS, type Preset, type CharacterPreset } from '../data/presets'
import { CATEGORIES, getItemsByCategory, type ClothingItem } from '../data/clothing'

export type Step = 'character' | 'customize' | 'wardrobe' | 'looks'

const STEPS = [
  { key: 'character' as Step, label: 'Персонаж', icon: User },
  { key: 'customize' as Step, label: 'Стиль', icon: Palette },
  { key: 'wardrobe' as Step, label: 'Гардероб', icon: Shirt },
  { key: 'looks' as Step, label: 'Образы', icon: Heart },
]

const TOGGLE_LABELS: Record<string, string> = {
  showJacket: 'Куртка',
  showHair: 'Волосы',
  showGlasses: 'Очки',
}

const COLOR_ICONS: Record<string, React.ReactNode> = {
  topColor: <Shirt size={14} strokeWidth={1.6} />,
  bottomColor: <PaintBucket size={14} strokeWidth={1.6} />,
  shoeColor: <Footprints size={14} strokeWidth={1.6} />,
}

const COLOR_LABELS: Record<string, string> = {
  topColor: 'Верх',
  bottomColor: 'Низ',
  shoeColor: 'Обувь',
}

interface Props {
  step: Step
  onStepChange: (step: Step) => void
  colors: Record<string, string>
  toggles: Record<string, boolean>
  selectedCharacter: string
  selectedItems: string[]
  onColorChange: (key: string, val: string) => void
  onToggle: (key: string) => void
  onPreset: (p: Preset) => void
  onCharacterSelect: (p: CharacterPreset) => void
  onItemSelect: (item: ClothingItem) => void
  onSaveLook: () => void
  onScreenshot: () => void
  onShowLooks: () => void
  savedLooksCount: number
}

export default function Sidebar({
  step, onStepChange,
  colors, toggles,
  selectedCharacter, selectedItems,
  onColorChange, onToggle, onPreset, onCharacterSelect,
  onItemSelect, onSaveLook, onScreenshot, onShowLooks,
  savedLooksCount,
}: Props) {
  const [clothingCategory, setClothingCategory] = useState('top')
  const [pickerKey, setPickerKey] = useState<string | null>(null)
  const pickerRef = useRef<HTMLInputElement>(null)
  const [collapsed, setCollapsed] = useState(false)

  const openPicker = (key: string) => {
    setPickerKey(key)
    setTimeout(() => pickerRef.current?.click(), 50)
  }

  const currentStepIdx = STEPS.findIndex(s => s.key === step)

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <button className="sidebar-collapse-btn" onClick={() => setCollapsed(v => !v)}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!collapsed && (
        <>
          {/* Logo */}
          <div className="sidebar-logo">
            <span className="logo-text">Vogue<span className="logo-accent">Verse</span></span>
            <span className="logo-sub">3D Fashion Platform</span>
          </div>

          {/* Step Navigation */}
          <nav className="step-nav">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isActive = s.key === step
              const isDone = i < currentStepIdx
              return (
                <button
                  key={s.key}
                  className={`step-btn${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
                  onClick={() => onStepChange(s.key)}
                >
                  <span className="step-icon">
                    <Icon size={16} />
                  </span>
                  <span className="step-label">{s.label}</span>
                  {isDone && <span className="step-check">✓</span>}
                </button>
              )
            })}
          </nav>

          {/* Progress bar */}
          <div className="step-progress">
            <div className="step-progress-fill" style={{ width: `${((currentStepIdx + 1) / STEPS.length) * 100}%` }} />
          </div>

          {/* Step Content */}
          <div className="step-content">
            {step === 'character' && (
              <div className="step-section">
                <h3 className="section-title">Выберите персонажа</h3>
                <p className="section-desc">Начните с базового аватара</p>
                <div className="character-grid">
                  {CHARACTER_PRESETS.map(cp => (
                    <button
                      key={cp.id}
                      className={`character-card${selectedCharacter === cp.id ? ' active' : ''}`}
                      onClick={() => onCharacterSelect(cp)}
                    >
                      <span className="char-emoji">{cp.emoji}</span>
                      <span className="char-name">{cp.name}</span>
                      <span className="char-desc">{cp.description}</span>
                      <div className="char-colors">
                        {Object.values(cp.colors).map((c, i) => (
                          <span key={i} className="char-dot" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'customize' && (
              <div className="step-section">
                <h3 className="section-title">Настройте стиль</h3>
                <p className="section-desc">Изменяйте параметры персонажа</p>

                <div className="subsection">
                  <h4 className="subsection-title">
                    <Sparkles size={14} /> Быстрые стили
                  </h4>
                  <div className="presets-row">
                    {PRESETS.map(p => (
                      <button key={p.name} className="style-chip" onClick={() => onPreset(p)}>
                        <span>{p.name}</span>
                        <div className="chip-dots">
                          {Object.values(p.colors).map((c, i) => (
                            <span key={i} className="chip-dot" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="subsection">
                  <h4 className="subsection-title">Элементы</h4>
                  <div className="toggle-group">
                    {Object.entries(TOGGLE_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        className={`toggle-pill${toggles[key] ? ' active' : ''}`}
                        onClick={() => onToggle(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="subsection">
                  <h4 className="subsection-title">Цвета</h4>
                  {['topColor', 'bottomColor', 'shoeColor'].map(key => (
                    <div key={key} className="color-row">
                      <div className="color-row-header">
                        <span className="color-row-icon">{COLOR_ICONS[key]}</span>
                        <span className="color-row-label">{COLOR_LABELS[key]}</span>
                      </div>
                      <div className="color-swatches-row">
                        {COLOR_OPTIONS[key].map(c => (
                          <button
                            key={c.value}
                            className={`swatch${colors[key] === c.value ? ' active' : ''}`}
                            style={{ backgroundColor: c.value }}
                            onClick={() => onColorChange(key, c.value)}
                            title={c.name}
                          />
                        ))}
                        <button className="swatch swatch-custom" onClick={() => openPicker(key)} title="Свой цвет">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'wardrobe' && (
              <div className="step-section">
                <h3 className="section-title">Гардероб</h3>
                <p className="section-desc">Выберите вещи для образа</p>

                <div className="category-tabs">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.key}
                      className={`cat-tab${clothingCategory === cat.key ? ' active' : ''}`}
                      onClick={() => setClothingCategory(cat.key)}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="items-grid">
                  {getItemsByCategory(clothingCategory).map(item => {
                    const isSelected = selectedItems.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        className={`item-card${isSelected ? ' selected' : ''}`}
                        onClick={() => onItemSelect(item)}
                      >
                        <span className="item-emoji">{item.emoji}</span>
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">{item.price} {item.currency}</span>
                        {item.color && (
                          <span className="item-color-dot" style={{ backgroundColor: item.color }} />
                        )}
                        {isSelected && <span className="item-check">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 'looks' && (
              <div className="step-section">
                <h3 className="section-title">Мои образы</h3>
                <p className="section-desc">Сохраняйте и покупайте луки</p>

                <button className="save-look-btn" onClick={onSaveLook}>
                  <Heart size={16} />
                  <span>Сохранить текущий образ</span>
                </button>

                <button className="save-look-btn secondary" onClick={onScreenshot}>
                  <Camera size={16} />
                  <span>Скриншот</span>
                </button>

                {savedLooksCount > 0 && (
                  <button className="view-looks-btn" onClick={onShowLooks}>
                    <ShoppingBag size={16} />
                    <span>Мои образы ({savedLooksCount})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <input
            ref={pickerRef}
            type="color"
            className="hidden-color-input"
            value={pickerKey ? colors[pickerKey] || '#fff' : '#fff'}
            onChange={e => { if (pickerKey) onColorChange(pickerKey, e.target.value) }}
          />
        </>
      )}
    </aside>
  )
}
