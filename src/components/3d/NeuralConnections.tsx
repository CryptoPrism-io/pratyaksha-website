'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { EmotionState } from '@/hooks/useEmotionAnalysis'

interface NeuralConnectionsProps {
  emotionState: EmotionState
}

export function NeuralConnections({ emotionState }: NeuralConnectionsProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 800

  // Generate sphere-distributed particles around the brain
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      // Sphere distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.5 + Math.random() * 1.0 // Radius between 1.5 and 2.5

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  // Animate particles based on emotion state
  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.elapsedTime
    const { speed, chaos } = emotionState

    // Rotate the entire particle system
    pointsRef.current.rotation.y += 0.002 * speed
    pointsRef.current.rotation.x = Math.sin(time * chaos * 0.5) * 0.1

    // Update individual particle positions for more organic movement
    const positions = pointsRef.current.geometry.attributes.position
    const posArray = positions.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const originalX = posArray[i3]
      const originalY = posArray[i3 + 1]

      // Add subtle oscillation based on chaos level
      posArray[i3] = originalX + Math.sin(time * speed + i * 0.1) * chaos * 0.02
      posArray[i3 + 1] = originalY + Math.cos(time * speed + i * 0.15) * chaos * 0.02
    }

    positions.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={emotionState.color}
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}
