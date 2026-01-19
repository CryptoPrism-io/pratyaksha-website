'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Preload } from '@react-three/drei'
import { Brain } from './Brain'
import { NeuralConnections } from './NeuralConnections'
import type { EmotionState } from '@/hooks/useEmotionAnalysis'
import { use3DPerformance, useReducedMotion } from '@/hooks/useEmotionAnalysis'

interface HeroSceneProps {
  emotionState: EmotionState
}

// Loading fallback for 3D scene
function Loader3D() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#6366F1" wireframe />
    </mesh>
  )
}

// Static fallback for devices that can't handle 3D
function StaticBrainFallback({ emotionState }: HeroSceneProps) {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-50 transition-colors duration-700"
        style={{ backgroundColor: emotionState.color }}
      />
      <div
        className="absolute inset-4 rounded-full glass-card flex items-center justify-center transition-[box-shadow,border-color] duration-500"
        style={{
          boxShadow: `0 0 60px ${emotionState.color}40`,
          borderColor: `${emotionState.color}30`,
        }}
      >
        <div
          className="w-32 h-32 rounded-full opacity-60 animate-pulse"
          style={{ backgroundColor: emotionState.tint }}
        />
      </div>
      {/* Simulated particles with CSS */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-ping"
            style={{
              backgroundColor: emotionState.color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function HeroScene({ emotionState }: HeroSceneProps) {
  const [mounted, setMounted] = useState(false)
  const [performance, setPerformance] = useState({ enable3D: true, quality: 'high' as const })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPerformance(use3DPerformance())
    setReducedMotion(useReducedMotion())
  }, [])

  // Don't render anything on server
  if (!mounted) {
    return (
      <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center glass-card">
        <div className="w-24 h-24 rounded-full bg-primary/30 animate-pulse" />
      </div>
    )
  }

  // Use static fallback for reduced motion or low-end devices
  if (reducedMotion || !performance.enable3D) {
    return <StaticBrainFallback emotionState={emotionState} />
  }

  return (
    <div className="w-full h-64 md:h-80 lg:h-96">
      <Canvas
        dpr={performance.quality === 'high' ? [1, 2] : [1, 1]}
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{
          antialias: performance.quality === 'high',
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={<Loader3D />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color={emotionState.color}
          />

          {/* Main brain */}
          <Brain emotionState={emotionState} />

          {/* Neural particles */}
          <NeuralConnections emotionState={emotionState} />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Allow subtle mouse interaction */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
