'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshTransmissionMaterial, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'
import { ScrollPhase } from '@/hooks/useScrollPhase'
import {
  ParticleCloud,
  ChaoticParticles,
  JournalParticles,
  AgentIntentParticles,
  AgentEmotionParticles,
  AgentThemeParticles,
  AgentInsightParticles,
  ClarityParticles,
} from '@/components/3d/ParticleCloud'

interface PhaseSceneProps {
  phase: ScrollPhase
  phaseProgress: number
  color: string
  chaos: number
  isTransitioning: boolean
  transitionProgress: number
}

export function PhaseScene({
  phase,
  phaseProgress,
  color,
  chaos,
  isTransitioning,
  transitionProgress,
}: PhaseSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [exploding, setExploding] = useState(false)

  // Trigger explosion during transitions
  useEffect(() => {
    if (isTransitioning && transitionProgress > 0.5) {
      setExploding(true)
    } else {
      setExploding(false)
    }
  }, [isTransitioning, transitionProgress])

  // Gentle rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Phase-specific particles */}
      <PhaseParticles
        phase={phase}
        color={color}
        chaos={chaos}
        exploding={exploding}
        phaseProgress={phaseProgress}
      />

      {/* Phase-specific central object */}
      <PhaseCentralObject
        phase={phase}
        color={color}
        phaseProgress={phaseProgress}
        transitionProgress={transitionProgress}
      />

      {/* Orbiting elements */}
      <PhaseOrbitingElements
        phase={phase}
        color={color}
        phaseProgress={phaseProgress}
      />

      {/* Energy rings */}
      <EnergyRings
        color={color}
        speed={chaos}
        opacity={0.3 + phaseProgress * 0.2}
      />
    </group>
  )
}

// Particles for each phase
function PhaseParticles({
  phase,
  color,
  chaos,
  exploding,
  phaseProgress,
}: {
  phase: ScrollPhase
  color: string
  chaos: number
  exploding: boolean
  phaseProgress: number
}) {
  const particleProps = {
    color,
    chaos,
    exploding,
    opacity: 0.6 + phaseProgress * 0.3,
  }

  switch (phase) {
    case 'chaos':
      return <ChaoticParticles {...particleProps} />
    case 'journal':
      return <JournalParticles {...particleProps} />
    case 'intent':
      return <AgentIntentParticles {...particleProps} />
    case 'emotion':
      return <AgentEmotionParticles {...particleProps} />
    case 'theme':
      return <AgentThemeParticles {...particleProps} />
    case 'insight':
      return <AgentInsightParticles {...particleProps} />
    case 'clarity':
      return <ClarityParticles {...particleProps} />
    default:
      return <ParticleCloud color={color} chaos={chaos} />
  }
}

// Central 3D object for each phase
function PhaseCentralObject({
  phase,
  color,
  phaseProgress,
  transitionProgress,
}: {
  phase: ScrollPhase
  color: string
  phaseProgress: number
  transitionProgress: number
}) {
  switch (phase) {
    case 'chaos':
      return <ChaoticBrain color={color} progress={phaseProgress} />
    case 'journal':
      return <FloatingJournal color={color} progress={phaseProgress} />
    case 'intent':
      return <ScannerEye color={color} progress={phaseProgress} />
    case 'emotion':
      return <PulsingHeart color={color} progress={phaseProgress} />
    case 'theme':
      return <ConstellationCore color={color} progress={phaseProgress} />
    case 'insight':
      return <StarBurst color={color} progress={phaseProgress} />
    case 'clarity':
      return <CrystalBrain color={color} progress={phaseProgress} />
    default:
      return null
  }
}

// Chaotic Brain - Phase 1
function ChaoticBrain({ color, progress }: { color: string; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Irregular pulsing
      const time = Date.now() * 0.001
      const irregularPulse = Math.sin(time * 3) * 0.1 + Math.sin(time * 7) * 0.05
      meshRef.current.scale.setScalar(1 + irregularPulse)
      meshRef.current.rotation.x += delta * (0.5 + Math.sin(time) * 0.3)
      meshRef.current.rotation.y += delta * 0.3
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.8
    }
  })

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        <Sphere ref={meshRef} args={[1, 32, 32]}>
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.3}
            chromaticAberration={0.5}
            distortion={0.8}
            distortionScale={0.8}
            temporalDistortion={0.3}
            color={color}
            transparent
            opacity={0.7}
          />
        </Sphere>
        <Sphere ref={innerRef} args={[0.5, 16, 16]}>
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </Sphere>
      </group>
    </Float>
  )
}

// Floating Journal - Phase 2
function FloatingJournal({ color, progress }: { color: string; progress: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
      const time = Date.now() * 0.001
      groupRef.current.position.y = Math.sin(time) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Book shape */}
        <mesh>
          <boxGeometry args={[1.2, 1.6, 0.15]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Pages */}
        <mesh position={[0.05, 0, 0]}>
          <boxGeometry args={[1.1, 1.5, 0.12]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0} roughness={0.9} />
        </mesh>
        {/* Spine glow */}
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.05, 1.6, 0.15]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        {/* Text lines */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0.1, 0.5 - i * 0.25, 0.08]}>
            <boxGeometry args={[0.8 - i * 0.1, 0.02, 0.01]} />
            <meshBasicMaterial color={color} transparent opacity={0.3 + progress * 0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Scanner Eye - Phase 3 (Intent Agent)
function ScannerEye({ color, progress }: { color: string; progress: number }) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const beamRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.z += delta * 0.5
    }
    if (innerRef.current) {
      innerRef.current.rotation.z -= delta * 0.8
      const time = Date.now() * 0.001
      innerRef.current.scale.setScalar(0.6 + Math.sin(time * 2) * 0.1)
    }
    if (beamRef.current) {
      const time = Date.now() * 0.001
      beamRef.current.rotation.y = time * 2
      beamRef.current.scale.x = 0.5 + Math.sin(time * 4) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1}>
      <group>
        {/* Outer ring */}
        <mesh ref={outerRef}>
          <torusGeometry args={[1.2, 0.08, 16, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        {/* Inner geometric shape */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.6, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.2}
            chromaticAberration={0.3}
            color={color}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Scanning beam */}
        <mesh ref={beamRef} position={[0, 0, 0]}>
          <planeGeometry args={[3, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Center eye */}
        <Sphere args={[0.2, 16, 16]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      </group>
    </Float>
  )
}

// Pulsing Heart - Phase 4 (Emotion Agent)
function PulsingHeart({ color, progress }: { color: string; progress: number }) {
  const heartRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (heartRef.current) {
      const time = Date.now() * 0.001
      // Heartbeat rhythm
      const beat = Math.pow(Math.sin(time * 2.5), 20) * 0.2 + Math.pow(Math.sin(time * 2.5 + 0.3), 20) * 0.1
      heartRef.current.scale.setScalar(1 + beat)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15}>
      <group ref={heartRef}>
        {/* Heart shape using spheres */}
        <Sphere args={[0.5, 32, 32]} position={[-0.3, 0.2, 0]}>
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.3}
            chromaticAberration={0.2}
            color={color}
            transparent
            opacity={0.85}
          />
        </Sphere>
        <Sphere args={[0.5, 32, 32]} position={[0.3, 0.2, 0]}>
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.3}
            chromaticAberration={0.2}
            color={color}
            transparent
            opacity={0.85}
          />
        </Sphere>
        {/* Bottom cone */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.65, 1, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.3}
            chromaticAberration={0.2}
            color={color}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Inner glow */}
        <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </Sphere>
      </group>
    </Float>
  )
}

// Constellation Core - Phase 5 (Theme Agent)
function ConstellationCore({ color, progress }: { color: string; progress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const nodes = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let i = 0; i < 12; i++) {
      const theta = (i / 12) * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.2 + Math.random() * 0.3
      positions.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ])
    }
    return positions
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
      groupRef.current.rotation.x += delta * 0.05
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.1}>
      <group ref={groupRef}>
        {/* Central core */}
        <Sphere args={[0.3, 16, 16]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Sphere>

        {/* Constellation nodes */}
        {nodes.map((pos, i) => (
          <group key={i}>
            <Sphere args={[0.08, 8, 8]} position={pos}>
              <meshBasicMaterial color={color} />
            </Sphere>
            {/* Connection to center */}
            <Line start={[0, 0, 0]} end={pos} color={color} opacity={0.3} />
            {/* Connection to next node */}
            <Line start={pos} end={nodes[(i + 1) % nodes.length]} color={color} opacity={0.2} />
          </group>
        ))}
      </group>
    </Float>
  )
}

// Star Burst - Phase 6 (Insight Agent)
function StarBurst({ color, progress }: { color: string; progress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
    if (coreRef.current) {
      const time = Date.now() * 0.001
      coreRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.2)
    }
  })

  const rays = useMemo(() => {
    return [...Array(8)].map((_, i) => {
      const angle = (i / 8) * Math.PI * 2
      return {
        rotation: [0, 0, angle] as [number, number, number],
        length: 1.5 + Math.random() * 0.5,
      }
    })
  }, [])

  return (
    <Float speed={2} rotationIntensity={0.2}>
      <group ref={groupRef}>
        {/* Central glowing core */}
        <Sphere ref={coreRef} args={[0.4, 32, 32]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
        <Sphere args={[0.5, 32, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </Sphere>

        {/* Star rays */}
        {rays.map((ray, i) => (
          <mesh key={i} rotation={ray.rotation}>
            <boxGeometry args={[ray.length, 0.05, 0.05]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
        ))}

        {/* Outer glow ring */}
        <mesh>
          <torusGeometry args={[1.2, 0.03, 16, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

// Crystal Brain - Phase 7 (Clarity)
function CrystalBrain({ color, progress }: { color: string; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const crystalsRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
      const time = Date.now() * 0.001
      meshRef.current.scale.setScalar(1 + Math.sin(time) * 0.05)
    }
    if (crystalsRef.current) {
      crystalsRef.current.rotation.y -= delta * 0.15
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group>
        {/* Main crystal brain */}
        <Sphere ref={meshRef} args={[0.8, 32, 32]}>
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.4}
            chromaticAberration={0.1}
            anisotropy={0.5}
            distortion={0.1}
            distortionScale={0.2}
            iridescence={1}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 800]}
            color={color}
            transparent
            opacity={0.95}
          />
        </Sphere>

        {/* Inner golden core */}
        <Sphere args={[0.3, 16, 16]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Sphere>

        {/* Orbiting crystal shards */}
        <group ref={crystalsRef}>
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            const radius = 1.3
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(i * 0.5) * 0.3,
                  Math.sin(angle) * radius,
                ]}
                rotation={[Math.random(), Math.random(), Math.random()]}
              >
                <octahedronGeometry args={[0.15, 0]} />
                <meshBasicMaterial color={color} transparent opacity={0.7} />
              </mesh>
            )
          })}
        </group>
      </group>
    </Float>
  )
}

// Orbiting elements for each phase
function PhaseOrbitingElements({
  phase,
  color,
  phaseProgress,
}: {
  phase: ScrollPhase
  color: string
  phaseProgress: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  // Different orbiting elements per phase
  const elementCount = phase === 'clarity' ? 8 : phase === 'chaos' ? 12 : 6

  return (
    <group ref={groupRef}>
      {[...Array(elementCount)].map((_, i) => {
        const angle = (i / elementCount) * Math.PI * 2
        const radius = 2.5 + Math.sin(i) * 0.5
        const yOffset = Math.cos(i * 2) * 0.5

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              yOffset,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.5 + phaseProgress * 0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

// Energy rings
function EnergyRings({
  color,
  speed,
  opacity,
}: {
  color: string
  speed: number
  opacity: number
}) {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.x += delta * speed * 0.5
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * speed * 0.4
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * speed * 0.3
  })

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.0, 0.012, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.6} />
      </mesh>
    </group>
  )
}

// Simple line component
function Line({
  start,
  end,
  color,
  opacity = 1,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
  opacity?: number
}) {
  const points = useMemo(() => {
    return new Float32Array([...start, ...end])
  }, [start, end])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}
