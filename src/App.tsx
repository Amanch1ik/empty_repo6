import { useState, useCallback, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Shirt } from 'lucide-react'
import * as THREE from 'three'
import Character from './components/Character'
import ClothingPanel from './components/ClothingPanel'
import { type Preset } from './data/presets'
import { saveConfig, loadConfig } from './utils/storage'

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  )
}

const defaults = {
  colors: { topColor: '#1a1a40', bottomColor: '#3d1a40', shoeColor: '#2a1a3a' },
  toggles: { showJacket: false, showHair: true, showGlasses: true },
}

export default function App() {
  const saved = loadConfig()

  const [colors, setColors] = useState(saved?.colors ?? defaults.colors)
  const [toggles, setToggles] = useState(saved?.toggles ?? defaults.toggles)

  useEffect(() => { saveConfig({ colors, toggles }) }, [colors, toggles])

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

  const screenshot = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    requestAnimationFrame(() => {
      const link = document.createElement('a')
      link.download = `wardrobe-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
  }, [])

  return (
    <>
      <header className="top-bar">
        <div className="logo">
          <Shirt size={20} strokeWidth={1.8} />
          <span>Гардероб</span>
        </div>
      </header>

      <div className="scene-container">
        <Canvas
          camera={{ position: [0, 0.7, 3], fov: 30 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0e0e14')
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.3
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 6, 5]} intensity={1.6} castShadow />
          <directionalLight position={[-4, 4, -2]} intensity={0.5} color="#c4b5fd" />
          <pointLight position={[0, 2.5, 2]} intensity={0.5} color="#e8e0ff" />

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
            position={[0, -0.851, 0]}
            opacity={0.3}
            scale={2}
            blur={3}
            far={2}
            resolution={256}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={6}
            minPolarAngle={Math.PI * 0.1}
            maxPolarAngle={Math.PI * 0.75}
            target={[0, 0.5, 0]}
          />
        </Canvas>
      </div>

      <ClothingPanel
        colors={colors}
        toggles={toggles}
        onColorChange={changeColor}
        onToggle={toggle}
        onPreset={applyPreset}
        onScreenshot={screenshot}
      />
    </>
  )
}
