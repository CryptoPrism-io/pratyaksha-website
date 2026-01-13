'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEmotionAnalysis } from '@/hooks/useEmotionAnalysis'

// Dynamically import 3D scene to avoid SSR issues
const HeroScene = dynamic(
  () => import('@/components/3d/HeroScene').then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center glass-card">
        <Sparkles className="w-24 h-24 text-primary animate-pulse" />
      </div>
    ),
  }
)

export function Hero() {
  const [inputText, setInputText] = useState('')
  const emotionState = useEmotionAnalysis(inputText)
  const [showHint, setShowHint] = useState(true)

  // Hide hint after user starts typing
  useEffect(() => {
    if (inputText.length > 0) {
      setShowHint(false)
    } else {
      const timer = setTimeout(() => setShowHint(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [inputText])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-background to-purple-950/30" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${emotionState.color}15` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4 / emotionState.speed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${emotionState.tint}20` }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5 / emotionState.speed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 3D Brain Scene */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <HeroScene emotionState={emotionState} />

          {/* Emotion feedback badge */}
          <AnimatePresence mode="wait">
            {emotionState.detectedKeyword && (
              <motion.div
                key={emotionState.detectedKeyword}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card"
                style={{
                  borderColor: `${emotionState.color}50`,
                  boxShadow: `0 0 20px ${emotionState.color}30`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: emotionState.color }}
                />
                <span className="text-sm font-medium capitalize">
                  Detecting: {emotionState.detectedKeyword}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="gradient-text">Your Mind,</span>
          <br />
          <span className="text-foreground">Visualized.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          AI-powered cognitive journaling that reveals emotional patterns,
          energy states, and actionable insights you&apos;ve never seen before.
        </motion.p>

        {/* Interactive input */}
        <motion.div
          className="mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div
            className="glass-card p-1 transition-all duration-300"
            style={{
              boxShadow: inputText
                ? `0 0 30px ${emotionState.color}30`
                : 'none',
              borderColor: inputText
                ? `${emotionState.color}30`
                : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Input
              type="text"
              placeholder="Write how you're feeling..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="bg-transparent border-0 text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 h-12"
            />
          </div>

          {/* Hint text */}
          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground mt-2"
              >
                Try typing:{' '}
                <span className="text-primary/70">anxious</span>,{' '}
                <span className="text-blue-400/70">calm</span>,{' '}
                <span className="text-amber-400/70">happy</span>, or{' '}
                <span className="text-green-400/70">hopeful</span>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            size="lg"
            className="glow-hover transition-all duration-300"
            style={{
              boxShadow: `0 0 20px ${emotionState.color}40`,
            }}
          >
            See Your Mind
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="glass-card border-0">
            Watch Demo
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: emotionState.color }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
