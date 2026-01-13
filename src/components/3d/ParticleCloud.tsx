'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  ParticleSystem,
  ParticleConfig,
  generateSpherePositions,
  generateHeartPositions,
  generateStarPositions,
  generateNetworkPositions,
  generateBookPositions,
} from '@/lib/particles/ParticleSystem'

export type ParticleShape = 'sphere' | 'heart' | 'star' | 'network' | 'book' | 'chaos' | 'crystal'

interface ParticleCloudProps {
  count?: number
  color?: string
  size?: number
  opacity?: number
  speed?: number
  chaos?: number
  spread?: number
  shape?: ParticleShape
  morphTo?: ParticleShape | null
  exploding?: boolean
  rotating?: boolean
  rotationSpeed?: number
}

export function ParticleCloud({
  count = 5000,
  color = '#6366F1',
  size = 0.03,
  opacity = 0.8,
  speed = 1,
  chaos = 0.3,
  spread = 2,
  shape = 'sphere',
  morphTo = null,
  exploding = false,
  rotating = true,
  rotationSpeed = 0.1,
}: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const systemRef = useRef<ParticleSystem | null>(null)
  const prevMorphTarget = useRef<ParticleShape | null>(null)

  // Initialize particle system
  const config: ParticleConfig = useMemo(() => ({
    count,
    size,
    color: new THREE.Color(color),
    opacity,
    speed,
    chaos,
    spread,
  }), [count, size, color, opacity, speed, chaos, spread])

  // Create particle system and morph targets
  useEffect(() => {
    const system = new ParticleSystem(config)

    // Add all morph targets
    system.addMorphTarget({
      name: 'sphere',
      positions: generateSpherePositions(count, spread),
    })
    system.addMorphTarget({
      name: 'heart',
      positions: generateHeartPositions(count, spread),
    })
    system.addMorphTarget({
      name: 'star',
      positions: generateStarPositions(count, spread, 8),
    })
    system.addMorphTarget({
      name: 'network',
      positions: generateNetworkPositions(count, spread, 25),
    })
    system.addMorphTarget({
      name: 'book',
      positions: generateBookPositions(count, spread * 0.8, spread * 1.2, spread * 0.2),
    })
    system.addMorphTarget({
      name: 'chaos',
      positions: generateSpherePositions(count, spread * 2), // Larger, more chaotic
    })
    system.addMorphTarget({
      name: 'crystal',
      positions: generateSpherePositions(count, spread * 0.8), // Tighter, more organized
    })

    // Set initial shape
    system.morphTo(shape, 0)

    systemRef.current = system

    return () => {
      system.dispose()
    }
  }, [count, spread, shape, config])

  // Handle color changes
  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.setColor(new THREE.Color(color))
    }
  }, [color])

  // Handle morph target changes
  useEffect(() => {
    if (systemRef.current && morphTo && morphTo !== prevMorphTarget.current) {
      systemRef.current.morphTo(morphTo, 1.5)
      prevMorphTarget.current = morphTo
    }
  }, [morphTo])

  // Handle explosion state
  useEffect(() => {
    if (systemRef.current) {
      if (exploding) {
        systemRef.current.explode()
      } else {
        systemRef.current.implode()
      }
    }
  }, [exploding])

  // Animation loop
  useFrame((_, delta) => {
    if (!pointsRef.current || !systemRef.current) return

    // Update particle system
    systemRef.current.update(delta, chaos)

    // Update geometry
    const positions = pointsRef.current.geometry.attributes.position
    const colors = pointsRef.current.geometry.attributes.color

    positions.array.set(systemRef.current.getPositions())
    colors.array.set(systemRef.current.getColors())

    positions.needsUpdate = true
    colors.needsUpdate = true

    // Rotation
    if (rotating) {
      pointsRef.current.rotation.y += delta * rotationSpeed
    }
  })

  // Initial geometry data
  const [initialPositions, initialColors, initialSizes] = useMemo(() => {
    const tempSystem = new ParticleSystem(config)
    return [
      tempSystem.getPositions(),
      tempSystem.getColors(),
      tempSystem.getSizes(),
    ]
  }, [config])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={initialColors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={initialSizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// Specialized particle clouds for each phase
export function ChaoticParticles({ color = '#EF4444', chaos = 1.5, ...props }: Partial<ParticleCloudProps>) {
  return (
    <ParticleCloud
      count={8000}
      color={color}
      chaos={chaos}
      spread={3}
      speed={2}
      shape="chaos"
      rotationSpeed={0.3}
      {...props}
    />
  )
}

export function JournalParticles({ color = '#3B82F6', ...props }: Partial<ParticleCloudProps>) {
  return (
    <ParticleCloud
      count={5000}
      color={color}
      chaos={0.2}
      spread={2}
      speed={0.5}
      shape="book"
      rotationSpeed={0.05}
      {...props}
    />
  )
}

export function AgentIntentParticles({ color = '#3B82F6', ...props }: Partial<ParticleCloudProps>) {
  return (
    <ParticleCloud
      count={6000}
      color={color}
      chaos={0.4}
      spread={2}
      speed={1}
      shape="sphere"
      rotationSpeed={0.2}
      {...props}
    />
  )
}

export function AgentEmotionParticles({ color = '#EC4899', ...props }: Partial<ParticleCloudProps>) {
  return (
    <ParticleCloud
      count={6000}
      color={color}
      chaos={0.3}
      spread={2}
      speed={0.8}
      shape="heart"
      rotationSpeed={0.15}
      {...props}
    />
  )
}

export function AgentThemeParticles({ color = '#8B5CF6', ...props }: Partial<ParticleCloudProps>) {
  return (
    <ParticleCloud
      count={6000}
      color={color}
      chaos={0.2}
      spread={2.5}
      speed={0.6}
      shape="network"
      rotationSpeed={0.1}
      {...props}
    />
  )
}

export function AgentInsightParticles({ color = '#10B981', ...props }: Partial<ParticleCloudProps>) {
  return (
    <ParticleCloud
      count={6000}
      color={color}
      chaos={0.5}
      spread={2}
      speed={1.2}
      shape="star"
      rotationSpeed={0.25}
      {...props}
    />
  )
}

export function ClarityParticles({ color = '#F59E0B', ...props }: Partial<ParticleCloudProps>) {
  return (
    <ParticleCloud
      count={7000}
      color={color}
      chaos={0.1}
      spread={1.5}
      speed={0.3}
      shape="crystal"
      rotationSpeed={0.08}
      {...props}
    />
  )
}
