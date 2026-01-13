'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshTransmissionMaterial, Environment, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { MotionValue } from 'framer-motion'

type BrainState = 'idle' | 'analyzing' | 'processing' | 'insight' | 'glow'

interface ImmersiveBrainProps {
  state: BrainState
  color: string
  progress: MotionValue<number>
}

// Neural particle system that reacts to state
function NeuralParticles({ state, color }: { state: BrainState; color: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 1500

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2 + Math.random() * 2

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      vel[i * 3] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
    return [pos, vel]
  }, [])

  // State-based animation parameters
  const stateConfig = useMemo(() => ({
    idle: { speed: 0.3, chaos: 0.1, scale: 1 },
    analyzing: { speed: 0.8, chaos: 0.3, scale: 1.1 },
    processing: { speed: 1.2, chaos: 0.5, scale: 1.2 },
    insight: { speed: 0.6, chaos: 0.2, scale: 1.3 },
    glow: { speed: 0.4, chaos: 0.15, scale: 1.4 },
  }), [])

  useFrame((_, delta) => {
    if (!particlesRef.current) return
    const config = stateConfig[state]

    particlesRef.current.rotation.y += delta * config.speed * 0.1
    particlesRef.current.rotation.x += delta * config.speed * 0.05

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] += velocities[i3] * config.chaos
      positions[i3 + 1] += velocities[i3 + 1] * config.chaos
      positions[i3 + 2] += velocities[i3 + 2] * config.chaos

      // Keep particles in bounds
      const dist = Math.sqrt(
        positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
      )
      if (dist > 4 || dist < 1.5) {
        velocities[i3] *= -1
        velocities[i3 + 1] *= -1
        velocities[i3 + 2] *= -1
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Main brain mesh
function BrainMesh({ state, color }: { state: BrainState; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const [targetColor, setTargetColor] = useState(new THREE.Color(color))
  const currentColor = useRef(new THREE.Color(color))

  useEffect(() => {
    setTargetColor(new THREE.Color(color))
  }, [color])

  // State-based transformations
  const stateConfig = useMemo(() => ({
    idle: { scale: 1, pulseSpeed: 1, pulseIntensity: 0.05 },
    analyzing: { scale: 1.1, pulseSpeed: 2, pulseIntensity: 0.1 },
    processing: { scale: 1.15, pulseSpeed: 3, pulseIntensity: 0.15 },
    insight: { scale: 1.2, pulseSpeed: 1.5, pulseIntensity: 0.08 },
    glow: { scale: 1.25, pulseSpeed: 0.8, pulseIntensity: 0.12 },
  }), [])

  useFrame((_, delta) => {
    if (!meshRef.current || !innerRef.current) return
    const config = stateConfig[state]
    const time = Date.now() * 0.001

    // Smooth color transition
    currentColor.current.lerp(targetColor, delta * 2)

    // Rotation
    meshRef.current.rotation.y += delta * 0.2
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1

    // Scale pulsing
    const pulse = Math.sin(time * config.pulseSpeed) * config.pulseIntensity
    const targetScale = config.scale + pulse
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 3
    )

    // Inner core animation
    innerRef.current.rotation.y -= delta * 0.5
    innerRef.current.scale.setScalar(0.5 + Math.sin(time * 2) * 0.1)
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Outer glass sphere */}
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.5}
            chromaticAberration={0.3}
            anisotropy={0.3}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color={currentColor.current}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Inner glowing core */}
        <Sphere ref={innerRef} args={[0.4, 32, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </Sphere>

        {/* Energy rings */}
        <EnergyRings color={color} state={state} />
      </group>
    </Float>
  )
}

// Animated energy rings around the brain
function EnergyRings({ color, state }: { color: string; state: BrainState }) {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  const speedMultiplier = useMemo(() => ({
    idle: 1,
    analyzing: 2,
    processing: 3,
    insight: 1.5,
    glow: 0.8,
  }), [])

  useFrame((_, delta) => {
    const speed = speedMultiplier[state]
    if (ring1Ref.current) ring1Ref.current.rotation.x += delta * speed
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * speed * 0.8
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * speed * 0.6
  })

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.7, 0.015, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[1.9, 0.01, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// Connection lines between brain and particles
function ConnectionLines({ color, state }: { color: string; state: BrainState }) {
  const linesRef = useRef<THREE.Group>(null)
  const lineCount = 20

  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const theta = (i / lineCount) * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      return {
        start: [0, 0, 0] as [number, number, number],
        end: [
          3 * Math.sin(phi) * Math.cos(theta),
          3 * Math.sin(phi) * Math.sin(theta),
          3 * Math.cos(phi),
        ] as [number, number, number],
      }
    })
  }, [])

  useFrame((_, delta) => {
    if (!linesRef.current) return
    linesRef.current.rotation.y += delta * 0.1
  })

  const opacity = state === 'analyzing' || state === 'processing' ? 0.3 : 0.1

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line.start, ...line.end])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={opacity} />
        </line>
      ))}
    </group>
  )
}

export function ImmersiveBrain({ state, color, progress }: ImmersiveBrainProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse" />
      </div>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color={color} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color={color}
      />

      {/* Main elements */}
      <BrainMesh state={state} color={color} />
      <NeuralParticles state={state} color={color} />
      <ConnectionLines color={color} state={state} />

      {/* Background stars */}
      <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />

      {/* Environment for reflections */}
      <Environment preset="night" />
    </Canvas>
  )
}
