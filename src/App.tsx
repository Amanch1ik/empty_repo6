import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Shirt } from 'lucide-react';
import Character from './components/Character';
import ClothingPanel from './components/ClothingPanel';

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

function App() {
  const [colors, setColors] = useState({
    topColor: '#1a1a40',
    bottomColor: '#3d1a40',
    shoeColor: '#2a1a3a',
  });

  const [toggles, setToggles] = useState({
    showJacket: false,
    showHair: true,
    showGlasses: true,
  });

  const handleColorChange = useCallback((key: string, color: string) => {
    setColors((prev) => ({ ...prev, [key]: color }));
  }, []);

  const handleToggle = useCallback((key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <>
      <header className="top-bar">
        <div className="logo">
          <Shirt size={20} strokeWidth={1.8} />
          <span>Wardrobe</span>
        </div>
      </header>

      <div className="scene-container">
        <Canvas
          camera={{ position: [0, 0.7, 3], fov: 30 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0e0e14');
            gl.toneMapping = 3;
            gl.toneMappingExposure = 1.3;
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

          {/* Subtle circular shadow — no big dark rectangle */}
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
        onColorChange={handleColorChange}
        onToggle={handleToggle}
      />
    </>
  );
}

export default App;
