import { useState, useCallback, useEffect, Suspense, Component, type ReactNode, type ErrorInfo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { ShoppingBag } from 'lucide-react'
import * as THREE from 'three'
import Character from './components/Character'
import Sidebar, { type Step } from './components/Sidebar'
import LookGallery from './components/LookGallery'
import BuyPanel from './components/BuyPanel'
import { type Preset, type CharacterPreset } from './data/presets'
import { type ClothingItem } from './data/clothing'
import {
  saveConfig, loadConfig, saveLook, loadLooks, deleteLook,
  generateId, type SavedLook
} from './utils/storage'

/* ---------- Error Boundary for 3D Canvas ---------- */
interface EBProps { children: ReactNode }
interface EBState { hasError: boolean; error?: Error }

class CanvasErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { hasError: false }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('3D Canvas error:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ff4696', gap: 12, padding: 40 }}>
          <span style={{ fontSize: 48 }}>🎮</span>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>WebGL не поддерживается</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Для просмотра 3D-модели откройте в Chrome, Firefox или Edge</p>
        </div>
      )
    }
    return this.props.children
  }
}

/* ---------- 3D Loader ---------- */
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  )
}

/* ---------- Defaults ---------- */
const defaults = {
  colors: { topColor: '#1a1a40', bottomColor: '#3d1a40', shoeColor: '#2a1a3a' },
  toggles: { showJacket: false, showHair: true, showGlasses: true },
}

/* ---------- App ---------- */
export default function App() {
  const saved = loadConfig()

  const [step, setStep] = useState<Step>('character')
  const [colors, setColors] = useState(saved?.colors ?? defaults.colors)
  const [toggles, setToggles] = useState(saved?.toggles ?? defaults.toggles)
  const [selectedCharacter, setSelectedCharacter] = useState(saved?.selectedCharacter ?? '')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [looks, setLooks] = useState<SavedLook[]>(loadLooks())
  const [showGallery, setShowGallery] = useState(false)
  const [showBuyPanel, setShowBuyPanel] = useState(false)
  const [buyItems, setBuyItems] = useState<string[]>([])

  useEffect(() => {
    saveConfig({ colors, toggles, selectedCharacter })
  }, [colors, toggles, selectedCharacter])

  const changeColor = useCallback((key: string, val: string) => {
    setColors(prev => ({ ...prev, [key]: val }))
  }, [])

  const toggle = useCallback((key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }, [])

  const applyPreset = useCallback((p: Preset) => {
    setColors({ ...p.colors })
    setToggles({ ...p.toggles })
  }, [])

  const selectCharacter = useCallback((cp: CharacterPreset) => {
    setSelectedCharacter(cp.id)
    setColors({ ...cp.colors })
    setToggles({ ...cp.toggles })
  }, [])

  const selectItem = useCallback((item: ClothingItem) => {
    if (item.category === 'accessory') {
      setToggles(prev => ({ ...prev, [item.colorKey]: !prev[item.colorKey as keyof typeof prev] }))
    } else if (item.color) {
      setColors(prev => ({ ...prev, [item.colorKey]: item.color }))
    }

    setSelectedItems(prev =>
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    )
  }, [])

  const screenshot = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    requestAnimationFrame(() => {
      const link = document.createElement('a')
      link.download = `vogueverse-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
  }, [])

  const handleSaveLook = useCallback(() => {
    const canvas = document.querySelector('canvas')
    let screenshotData: string | undefined
    if (canvas) {
      try { screenshotData = canvas.toDataURL('image/png') } catch {}
    }

    const look: SavedLook = {
      id: generateId(),
      name: `Образ ${looks.length + 1}`,
      timestamp: Date.now(),
      colors: { ...colors },
      toggles: { ...toggles },
      selectedItems: [...selectedItems],
      screenshot: screenshotData,
    }

    saveLook(look)
    setLooks(loadLooks())
  }, [colors, toggles, selectedItems, looks.length])

  const handleDeleteLook = useCallback((id: string) => {
    deleteLook(id)
    setLooks(loadLooks())
  }, [])

  const handleApplyLook = useCallback((look: SavedLook) => {
    setColors({ ...look.colors })
    setToggles({ ...look.toggles })
    setSelectedItems([...look.selectedItems])
    setShowGallery(false)
  }, [])

  const handleBuyLook = useCallback((look: SavedLook) => {
    setBuyItems(look.selectedItems)
    setShowGallery(false)
    setShowBuyPanel(true)
  }, [])

  const handleBuyCurrent = useCallback(() => {
    setBuyItems(selectedItems)
    setShowBuyPanel(true)
  }, [selectedItems])

  return (
    <div className="app-layout">
      <Sidebar
        step={step}
        onStepChange={setStep}
        colors={colors}
        toggles={toggles}
        selectedCharacter={selectedCharacter}
        selectedItems={selectedItems}
        onColorChange={changeColor}
        onToggle={toggle}
        onPreset={applyPreset}
        onCharacterSelect={selectCharacter}
        onItemSelect={selectItem}
        onSaveLook={handleSaveLook}
        onScreenshot={screenshot}
        onShowLooks={() => setShowGallery(true)}
        savedLooksCount={looks.length}
      />

      <div className="scene-container">
        {/* Watermark */}
        <div className="scene-watermark">
          <span className="watermark-text">
            Vogue<span className="watermark-accent">Verse</span>
          </span>
        </div>

        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0.7, 4], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            onCreated={({ gl }) => {
              gl.setClearColor('#ffffff')
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.1
            }}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[0, 3, 2]} intensity={0.6} />

            <Suspense fallback={<Loader />}>
              <Character
                topColor={colors.topColor}
                bottomColor={colors.bottomColor}
                shoeColor={colors.shoeColor}
                showJacket={toggles.showJacket}
                showHair={toggles.showHair}
                showGlasses={toggles.showGlasses}
              />
              <Environment preset="city" />
            </Suspense>

            <ContactShadows
              position={[0, -1.11, 0]}
              opacity={0.3}
              scale={2.5}
              blur={2}
              far={1.5}
              resolution={256}
            />

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={1.8}
              maxDistance={6}
              minPolarAngle={Math.PI * 0.1}
              maxPolarAngle={Math.PI * 0.75}
              target={[0, 0, 0]}
            />
          </Canvas>
        </CanvasErrorBoundary>

        {/* Floating Buy Button */}
        {selectedItems.length > 0 && (
          <button className="buy-float-btn" onClick={handleBuyCurrent}>
            <ShoppingBag size={18} />
            <span>Купить образ</span>
            <span className="buy-float-count">{selectedItems.length}</span>
          </button>
        )}
      </div>

      {/* Modals */}
      {showGallery && (
        <LookGallery
          looks={looks}
          onApply={handleApplyLook}
          onDelete={handleDeleteLook}
          onBuy={handleBuyLook}
          onClose={() => setShowGallery(false)}
        />
      )}

      {showBuyPanel && (
        <BuyPanel
          itemIds={buyItems}
          onClose={() => setShowBuyPanel(false)}
        />
      )}
    </div>
  )
}
