import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

interface CharacterProps {
  topColor: string;
  bottomColor: string;
  shoeColor: string;
  showJacket: boolean;
  showHair: boolean;
  showGlasses: boolean;
}

const JACKET_COLOR = new THREE.Color('#7c3aed');

export default function Character({
  topColor, bottomColor, shoeColor,
  showJacket, showHair, showGlasses,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<{
    top: THREE.SkinnedMesh | null;
    bottom: THREE.SkinnedMesh | null;
    footwear: THREE.SkinnedMesh | null;
    hair: THREE.Object3D[];
    glasses: THREE.Object3D[];
    jacket: THREE.SkinnedMesh | null;
  }>({ top: null, bottom: null, footwear: null, hair: [], glasses: [], jacket: null });

  const { scene } = useGLTF('/models/avatar.glb');
  const model = useMemo(() => cloneSkeleton(scene), [scene]);

  /* One-time setup: discover meshes, create jacket overlay */
  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh || child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
      }

      if (child instanceof THREE.SkinnedMesh) {
        const name = child.name;

        if (name.includes('Outfit_Top')) {
          child.material = (child.material as THREE.MeshStandardMaterial).clone();
          meshesRef.current.top = child;

          /* Create jacket: clone of outfit_top with accent color + scale up */
          if (!meshesRef.current.jacket) {
            const jacket = child.clone();
            jacket.name = 'Jacket_Overlay';
            const mat = (child.material as THREE.MeshStandardMaterial).clone();
            mat.color = JACKET_COLOR.clone();
            mat.roughness = 0.45;
            mat.metalness = 0.05;
            jacket.material = mat;
            jacket.skeleton = child.skeleton;
            jacket.bindMatrix.copy(child.bindMatrix);
            jacket.bindMatrixInverse.copy(child.bindMatrixInverse);
            jacket.scale.set(1.035, 1.025, 1.045);
            child.parent?.add(jacket);
            meshesRef.current.jacket = jacket;
          }
        }

        if (name.includes('Outfit_Bottom')) {
          child.material = (child.material as THREE.MeshStandardMaterial).clone();
          meshesRef.current.bottom = child;
        }

        if (name.includes('Outfit_Footwear')) {
          child.material = (child.material as THREE.MeshStandardMaterial).clone();
          meshesRef.current.footwear = child;
        }
      }

      /* Collect hair and glasses meshes for toggling */
      if (child.name.includes('Hair') || child.name.includes('hair')) {
        meshesRef.current.hair.push(child);
      }
      /* EyeLeft and EyeRight are NOT glasses; look for glasses-specific patterns */
      if (child.name.includes('Glasses') || child.name.includes('glasses')) {
        meshesRef.current.glasses.push(child);
      }
    });
  }, [model]);

  /* ── Color effects ───────────────────────────── */
  useEffect(() => {
    const m = meshesRef.current.top;
    if (m) { (m.material as THREE.MeshStandardMaterial).color.set(topColor); }
  }, [topColor]);

  useEffect(() => {
    const m = meshesRef.current.bottom;
    if (m) { (m.material as THREE.MeshStandardMaterial).color.set(bottomColor); }
  }, [bottomColor]);

  useEffect(() => {
    const m = meshesRef.current.footwear;
    if (m) { (m.material as THREE.MeshStandardMaterial).color.set(shoeColor); }
  }, [shoeColor]);

  /* ── Toggle effects ──────────────────────────── */
  useEffect(() => {
    if (meshesRef.current.jacket) meshesRef.current.jacket.visible = showJacket;
  }, [showJacket]);

  useEffect(() => {
    meshesRef.current.hair.forEach((h) => { h.visible = showHair; });
  }, [showHair]);

  useEffect(() => {
    meshesRef.current.glasses.forEach((g) => { g.visible = showGlasses; });
  }, [showGlasses]);

  /* Gentle idle sway */
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, -0.85, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload('/models/avatar.glb');
