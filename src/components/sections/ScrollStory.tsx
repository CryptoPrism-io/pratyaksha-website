'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollSequence } from '@/components/scroll'

interface TextOverlay {
  title: string
  subtitle?: string
  description?: string
}

const SECTION_CONTENT: TextOverlay[] = [
  {
    title: 'Pratyaksha',
    subtitle: 'प्रत्यक्ष',
    description: 'Direct Perception',
  },
  {
    title: 'Your Thoughts Enter',
    subtitle: 'Raw, unfiltered expression',
    description: 'No judgment. No formatting. Just you.',
  },
  {
    title: 'AI Understands',
    subtitle: '4-Agent Pipeline',
    description: 'Intent • Emotion • Theme • Insight',
  },
  {
    title: 'Patterns Emerge',
    subtitle: '21 Visualizations',
    description: 'See your mind. Clearly.',
  },
]

export function ScrollStory() {
  const [currentSection, setCurrentSection] = useState(0)
  const [progress, setProgress] = useState(0)

  const content = SECTION_CONTENT[currentSection]

  return (
    <ScrollSequence
      height="400vh"
      showLoader={true}
      onSectionChange={setCurrentSection}
      onProgress={(p) => setProgress(p)}
      animationDuration={4000}
      className="bg-black"
    >
      {/* Text overlay container */}
      <div className="h-screen flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto backdrop-blur-sm bg-black/30 rounded-3xl px-8 py-12 md:px-16 md:py-16"
          >
            {/* Main title */}
            <h2
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)' }}
            >
              {content.title}
            </h2>

            {/* Subtitle */}
            {content.subtitle && (
              <p
                className="text-2xl md:text-3xl lg:text-4xl text-cyan-400 mb-4 font-light"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
              >
                {content.subtitle}
              </p>
            )}

            {/* Description */}
            {content.description && (
              <p
                className="text-lg md:text-xl text-white/90"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                {content.description}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          style={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </ScrollSequence>
  )
}
