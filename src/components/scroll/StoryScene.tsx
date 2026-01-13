'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Stars, PerspectiveCamera } from '@react-three/drei'
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion'
import { useScrollPhase, PHASES, interpolatePhaseColor, getPhaseChaos } from '@/hooks/useScrollPhase'
import { PhaseScene } from './PhaseScene'
import { PhaseText } from './PhaseText'
import { ProgressIndicator } from './ProgressIndicator'

export function StoryScene() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 animate-pulse mx-auto mb-4" />
          <p className="text-white/50">Preparing your journey...</p>
        </div>
      </div>
    )
  }

  return <StorySceneContent />
}

// Separate component that only renders after mount
function StorySceneContent() {
  const containerRef = useRef<HTMLDivElement>(null!)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  })

  const phaseState = useScrollPhase(smoothProgress)
  const currentColor = interpolatePhaseColor(
    phaseState.globalProgress,
    phaseState.phaseConfig,
    phaseState.nextPhase
  )

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: '700vh' }} // 7 phases x 100vh
    >
      {/* Fixed 3D Scene */}
      <div className="fixed inset-0 z-0">
        {/* Background gradient */}
        <motion.div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, ${currentColor}20 0%, transparent 60%)`,
          }}
        />

        {/* 3D Canvas */}
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {/* Dynamic camera */}
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 7]}
              fov={45}
            />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color={currentColor} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
            <spotLight
              position={[0, 10, 0]}
              angle={0.3}
              penumbra={1}
              intensity={0.8}
              color={currentColor}
            />

            {/* Phase-specific 3D scene */}
            <PhaseScene
              phase={phaseState.currentPhase}
              phaseProgress={phaseState.phaseProgress}
              color={currentColor}
              chaos={getPhaseChaos(phaseState.currentPhase, phaseState.phaseProgress)}
              isTransitioning={phaseState.isTransitioning}
              transitionProgress={phaseState.transitionProgress}
            />

            {/* Background stars */}
            <Stars
              radius={100}
              depth={50}
              count={3000}
              factor={4}
              fade
              speed={0.5}
            />

            {/* Environment */}
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Fixed Text Overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <PhaseText
          phaseState={phaseState}
          scrollProgress={smoothProgress}
        />
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20">
        <ProgressIndicator
          phases={PHASES}
          currentPhaseIndex={phaseState.phaseIndex}
          phaseProgress={phaseState.phaseProgress}
        />
      </div>

      {/* Scroll hint */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 1 }}
        animate={{ opacity: phaseState.phaseIndex === PHASES.length - 1 ? 0 : 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}
