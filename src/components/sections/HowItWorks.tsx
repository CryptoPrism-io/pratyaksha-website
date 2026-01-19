'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AgentCard } from '@/components/pipeline/AgentCard'
import { SampleEntry } from '@/components/pipeline/SampleEntry'
import { EnergyBar, ModeDisplay, EnergyShape } from '@/components/pipeline/EnergyBar'
import { SankeyDiagram } from '@/components/pipeline/SankeyDiagram'
import { InsightCard } from '@/components/pipeline/InsightCard'

type AgentType = 'none' | 'intent' | 'emotion' | 'theme' | 'insight'

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeAgent, setActiveAgent] = useState<AgentType>('none')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map scroll progress to active agent
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.15) {
        setActiveAgent('none')
      } else if (latest < 0.35) {
        setActiveAgent('intent')
      } else if (latest < 0.55) {
        setActiveAgent('emotion')
      } else if (latest < 0.75) {
        setActiveAgent('theme')
      } else {
        setActiveAgent('insight')
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  // Progress within each agent section
  const getAgentProgress = (agent: AgentType): number => {
    const progress = scrollYProgress.get()
    switch (agent) {
      case 'intent':
        return Math.max(0, Math.min(1, (progress - 0.15) / 0.2))
      case 'emotion':
        return Math.max(0, Math.min(1, (progress - 0.35) / 0.2))
      case 'theme':
        return Math.max(0, Math.min(1, (progress - 0.55) / 0.2))
      case 'insight':
        return Math.max(0, Math.min(1, (progress - 0.75) / 0.25))
      default:
        return 0
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[400vh]"
    >
      {/* Sticky container */}
      <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden py-16">
        <div className="max-w-6xl mx-auto px-4 w-full">
          {/* Section header - Enhanced typography */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display tracking-tight">
              <span className="gradient-text text-shadow-data">How It Works</span>
            </h2>
            <p className="text-lg text-white-60 max-w-2xl mx-auto font-light">
              Watch as our 4-agent AI pipeline analyzes your thoughts in real-time
            </p>
          </motion.div>

          {/* Main content grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start">
            {/* Left side - Sample entry */}
            <div className="lg:sticky lg:top-32">
              <div className="glass-card-premium p-8">
                <p className="text-sm text-white-55 mb-4 uppercase tracking-wider font-medium">
                  Sample Journal Entry
                </p>
                <SampleEntry
                  activeAgent={activeAgent}
                  progress={scrollYProgress.get()}
                />
              </div>

              {/* Progress indicator */}
              <div className="mt-6 flex justify-center gap-2">
                {(['intent', 'emotion', 'theme', 'insight'] as const).map((agent, idx) => (
                  <div
                    key={agent}
                    className={`w-2 h-2 rounded-full transition-[width,background-color] duration-300 ${
                      activeAgent === agent
                        ? 'w-8 bg-primary'
                        : activeAgent === 'none' ||
                          ['intent', 'emotion', 'theme', 'insight'].indexOf(activeAgent) < idx
                          ? 'bg-white/20'
                          : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right side - Agent cards */}
            <div className="space-y-4">
              {/* Intent Agent */}
              <AgentCard
                agent="intent"
                name="Intent Agent"
                description="Classifies entry type and extracts key phrases"
                isActive={activeAgent === 'intent'}
                progress={getAgentProgress('intent')}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Detected Type:</span>
                    <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                      Emotional
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs">
                      anxious
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs">
                      meeting
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">
                      push through
                    </span>
                  </div>
                </div>
              </AgentCard>

              {/* Emotion Agent */}
              <AgentCard
                agent="emotion"
                name="Emotion Agent"
                description="Analyzes mood, energy, and emotional patterns"
                isActive={activeAgent === 'emotion'}
                progress={getAgentProgress('emotion')}
              >
                <div className="space-y-4">
                  <ModeDisplay
                    mode="Anxious"
                    subMode="Overthinking"
                    isActive={activeAgent === 'emotion'}
                  />
                  <EnergyBar
                    level={4}
                    label="Energy Level"
                    isActive={activeAgent === 'emotion'}
                  />
                  <EnergyShape
                    shape="chaotic"
                    isActive={activeAgent === 'emotion'}
                  />
                </div>
              </AgentCard>

              {/* Theme Agent */}
              <AgentCard
                agent="theme"
                name="Theme Agent"
                description="Identifies patterns, loops, and contradictions"
                isActive={activeAgent === 'theme'}
                progress={getAgentProgress('theme')}
              >
                <SankeyDiagram
                  isActive={activeAgent === 'theme'}
                  progress={getAgentProgress('theme')}
                />
              </AgentCard>

              {/* Insight Agent */}
              <AgentCard
                agent="insight"
                name="Insight Agent"
                description="Generates actionable recommendations"
                isActive={activeAgent === 'insight'}
                progress={getAgentProgress('insight')}
              >
                <InsightCard isActive={activeAgent === 'insight'} />
              </AgentCard>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint at bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground mb-2">Scroll to explore each agent</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full mx-auto flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
