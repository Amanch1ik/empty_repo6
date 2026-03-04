import { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

interface Props {
  topColor: string
  bottomColor: string
  shoeColor: string
  showJacket: boolean
  showHair: boolean
  showGlasses: boolean
}

export default function Character({
  topColor, bottomColor, shoeColor,
  showJacket, showHair, showGlasses,
}: Props) {
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<{
    top: THREE.SkinnedMesh | null
    bottom: THREE.SkinnedMesh | null
    shoes: THREE.SkinnedMesh | null
    hair: THREE.Object3D[]
    glasses: THREE.Object3D[]
    jacket: THREE.SkinnedMesh | null
    blinkMesh: THREE.SkinnedMesh | null
    blinkIdx: number
  }>({ top: null, bottom: null, shoes: null, hair: [], glasses: [], jacket: null, blinkMesh: null, blinkIdx: -1 })

  const { scene } = useGLTF('/models/avatar.glb')
  const model = useMemo(() => cloneSkeleton(scene), [scene])

  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh || child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.frustumCulled = false
      }

      if (!(child instanceof THREE.SkinnedMesh)) {
        if (child.name.includes('Hair') || child.name.includes('hair'))
          meshes.current.hair.push(child)
        if (child.name.includes('Glasses') || child.name.includes('glasses'))
          meshes.current.glasses.push(child)
        return
      }

      const n = child.name

      // blink morph target
      if (n.includes('Head') || n.includes('EyeLeft') || n.includes('Wolf3D_Head')) {
        const dict = child.morphTargetDictionary
        if (dict) {
          const key = Object.keys(dict).find(k => k.toLowerCase().includes('eyeblink'))
          if (key && !meshes.current.blinkMesh) {
            meshes.current.blinkMesh = child
            meshes.current.blinkIdx = dict[key]
          }
        }
      }

      if (n.includes('Outfit_Top')) {
        const m = (child.material as THREE.MeshStandardMaterial).clone()
        m.map = null
        m.roughness = 0.6
        m.metalness = 0.05
        child.material = m
        meshes.current.top = child

        if (!meshes.current.jacket) {
          const jk = child.clone()
          jk.name = 'JacketOverlay'
          const jm = m.clone()
          jm.color = new THREE.Color('#6d28d9')
          jm.roughness = 0.45
          jm.metalness = 0.1
          jk.material = jm
          jk.skeleton = child.skeleton
          jk.bindMatrix.copy(child.bindMatrix)
          jk.bindMatrixInverse.copy(child.bindMatrixInverse)
          jk.scale.set(1.08, 1.05, 1.09)
          jk.renderOrder = 1
          jk.frustumCulled = false
          child.parent?.add(jk)
          meshes.current.jacket = jk
        }
      }

      if (n.includes('Outfit_Bottom')) {
        const m = (child.material as THREE.MeshStandardMaterial).clone()
        m.map = null
        m.roughness = 0.65
        m.metalness = 0.02
        child.material = m
        meshes.current.bottom = child
      }

      if (n.includes('Outfit_Footwear')) {
        const m = (child.material as THREE.MeshStandardMaterial).clone()
        m.map = null
        m.roughness = 0.4
        m.metalness = 0.1
        child.material = m
        meshes.current.shoes = child
      }

      if (child.name.includes('Hair') || child.name.includes('hair'))
        meshes.current.hair.push(child)
      if (child.name.includes('Glasses') || child.name.includes('glasses'))
        meshes.current.glasses.push(child)
    })
  }, [model])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()

    group.current.rotation.y = Math.sin(t * 0.5) * 0.06
    group.current.scale.setY(1 + Math.sin(t * 1.2) * 0.003)

    // blink
    const ref = meshes.current
    if (ref.blinkMesh && ref.blinkIdx >= 0 && ref.blinkMesh.morphTargetInfluences) {
      const cycle = t % 4
      let v = 0
      if (cycle > 3.5 && cycle < 3.7) v = Math.sin(((cycle - 3.5) / 0.2) * Math.PI)
      ref.blinkMesh.morphTargetInfluences[ref.blinkIdx] = v
    }

    if (ref.top) (ref.top.material as THREE.MeshStandardMaterial).color.set(topColor)
    if (ref.bottom) (ref.bottom.material as THREE.MeshStandardMaterial).color.set(bottomColor)
    if (ref.shoes) (ref.shoes.material as THREE.MeshStandardMaterial).color.set(shoeColor)

    if (ref.jacket) ref.jacket.visible = showJacket
    if (ref.top) ref.top.visible = !showJacket
    ref.hair.forEach(h => { h.visible = showHair })
    ref.glasses.forEach(g => { g.visible = showGlasses })
  })

  return (
    <group ref={group} position={[0, -0.85, 0]}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload('/models/avatar.glb')
