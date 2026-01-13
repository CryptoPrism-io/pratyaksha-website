'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import type { EmotionState } from '@/hooks/useEmotionAnalysis'

interface BrainProps {
  emotionState: EmotionState
}

// Stylized brain made of overlapping spheres (placeholder until we get a real model)
export function Brain({ emotionState }: BrainProps) {
  const groupRef = useRef<THREE.Group>(null)
  const mainRef = useRef<THREE.Mesh>(null)

  // Create brain hemisphere positions
  const hemispheres = useMemo(() => [
    { position: [-0.3, 0.1, 0] as [number, number, number], scale: 0.85 },
    { position: [0.3, 0.1, 0] as [number, number, number], scale: 0.85 },
    { position: [0, -0.2, 0.1] as [number, number, number], scale: 0.6 }, // Cerebellum
    { position: [0, 0.4, -0.1] as [number, number, number], scale: 0.5 }, // Top
  ], [])

  // Animate brain based on emotion
  useFrame((state) => {
    if (!groupRef.current || !mainRef.current) return

    const time = state.clock.elapsedTime
    const { speed, chaos } = emotionState

    // Gentle rotation
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1 + time * 0.05

    // Floating motion
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05

    // Pulse based on emotion intensity
    const pulse = 1 + Math.sin(time * speed * 2) * chaos * 0.05
    groupRef.current.scale.setScalar(pulse)
  })

  return (
    <group ref={groupRef}>
      {/* Main brain structure */}
      {hemispheres.map((hemisphere, index) => (
        <Sphere
          key={index}
          ref={index === 0 ? mainRef : undefined}
          args={[hemisphere.scale, 32, 32]}
          position={hemisphere.position}
        >
          <MeshTransmissionMaterial
            thickness={0.5}
            roughness={0.3}
            transmission={0.95}
            ior={1.4}
            chromaticAberration={0.02}
            color={emotionState.tint}
            backside
            samples={8}
            resolution={256}
          />
        </Sphere>
      ))}

      {/* Inner glow core */}
      <Sphere args={[0.4, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={emotionState.color}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Pulsing highlight */}
      <PulsingCore color={emotionState.color} speed={emotionState.speed} />
    </group>
  )
}

// Inner pulsing core that responds to emotions
function PulsingCore({ color, speed }: { color: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const scale = 0.2 + Math.sin(time * speed * 3) * 0.1
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}
