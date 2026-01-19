'use client'

import { useState } from 'react'
import { ScrollSequence } from '@/components/scroll'
import { motion } from 'framer-motion'

const SECTION_TEXT = [
  {
    title: 'Pratyaksha',
    subtitle: 'प्रत्यक्ष',
    description: 'Direct Perception',
  },
  {
    title: 'Your Thoughts Enter',
    subtitle: 'Raw journal entries',
    description: 'Unfiltered, authentic expression',
  },
  {
    title: 'AI Analyzes',
    subtitle: '4-Agent Pipeline',
    description: 'Intent • Emotion • Theme • Insight',
  },
  {
    title: 'Patterns Emerge',
    subtitle: 'Visualizations reveal truth',
    description: 'See your mind. Clearly.',
  },
]

export default function ScrollTestPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [progress, setProgress] = useState(0)

  return (
    <main className="bg-black min-h-screen">
      {/* Header */}
      <div className="fixed top-4 left-4 z-50 text-white/50 text-sm font-mono">
        <p>Section: {currentSection + 1}/4</p>
        <p>Progress: {Math.round(progress * 100)}%</p>
      </div>

      {/* Skip hint */}
      <div className="fixed top-4 right-4 z-50">
        <a
          href="/"
          className="text-white/50 text-sm hover:text-white transition-colors"
        >
          ← Back to Home
        </a>
      </div>

      {/* Scroll sequence */}
      <ScrollSequence
        height="500vh"
        onSectionChange={setCurrentSection}
        onProgress={(p) => setProgress(p)}
      >
        {/* Text overlay */}
        <div className="h-screen flex items-center justify-center">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-2">
              {SECTION_TEXT[currentSection].title}
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-400 mb-4">
              {SECTION_TEXT[currentSection].subtitle}
            </p>
            <p className="text-lg text-white/60">
              {SECTION_TEXT[currentSection].description}
            </p>
          </motion.div>
        </div>
      </ScrollSequence>

      {/* Footer section after scroll */}
      <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Scroll Animation Complete</h2>
          <p className="text-white/60 mb-8">
            The scroll sequence has ended. Ready for Phase 3 integration.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Return Home
          </a>
        </div>
      </section>
    </main>
  )
}
