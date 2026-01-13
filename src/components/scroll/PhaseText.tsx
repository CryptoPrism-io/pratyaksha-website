'use client'

import { useState } from 'react'
import { motion, AnimatePresence, MotionValue, useTransform } from 'framer-motion'
import { ScrollPhaseState, PHASES } from '@/hooks/useScrollPhase'

interface PhaseTextProps {
  phaseState: ScrollPhaseState
  scrollProgress: MotionValue<number>
}

export function PhaseText({ phaseState, scrollProgress }: PhaseTextProps) {
  const { phaseConfig, phaseProgress, phaseIndex, currentPhase } = phaseState

  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl"
        >
          {/* Agent badge for AI phases */}
          {['intent', 'emotion', 'theme', 'insight'].includes(currentPhase) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${phaseConfig.color}20`,
                  border: `1px solid ${phaseConfig.color}40`,
                  color: phaseConfig.color,
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: phaseConfig.color }} />
                {phaseConfig.name}
              </span>
            </motion.div>
          )}

          {/* Main title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {phaseConfig.title}
          </motion.h1>

          {/* Subtitle with phase color */}
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            style={{ color: phaseConfig.color }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {phaseConfig.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {phaseConfig.description}
          </motion.p>

          {/* CTA for final phase */}
          {currentPhase === 'clarity' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 pointer-events-auto"
            >
              <WaitlistForm accentColor={phaseConfig.color} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Phase-specific decorative elements */}
      <PhaseDecorations phase={currentPhase} color={phaseConfig.color} />
    </div>
  )
}

// Decorative elements that appear with text
function PhaseDecorations({ phase, color }: { phase: string; color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Chaos phase - scattered fragments */}
      {phase === 'chaos' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: color,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Journal phase - floating lines */}
      {phase === 'journal' && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-1/4 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-0.5 rounded-full mb-3"
              style={{
                backgroundColor: color,
                width: `${150 - i * 20}px`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </motion.div>
      )}

      {/* AI Agent phases - scanning lines */}
      {['intent', 'emotion', 'theme', 'insight'].includes(phase) && (
        <motion.div
          className="absolute left-0 right-0 top-1/2 h-px"
          style={{ backgroundColor: color }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.2 }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Clarity phase - radiating glow */}
      {phase === 'clarity' && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  )
}

// Waitlist form for final CTA
function WaitlistForm({ accentColor }: { accentColor: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))

    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-3 px-8 py-4 rounded-full"
        style={{
          backgroundColor: `${accentColor}20`,
          border: `1px solid ${accentColor}40`,
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke={accentColor} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span style={{ color: accentColor }} className="font-medium">
          You're on the list! We'll be in touch soon.
        </span>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email..."
        required
        className="w-full sm:w-80 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: accentColor,
          color: '#000',
        }}
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Joining...
          </span>
        ) : (
          'Join Waitlist'
        )}
      </button>
    </form>
  )
}
