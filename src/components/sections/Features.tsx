'use client'

import { motion } from 'framer-motion'
import { BentoCard } from '@/components/bento/BentoCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

const charts = [
  {
    title: 'Emotional Timeline',
    description: 'Track emotional patterns over time',
    size: '2x2' as const,
    chartType: 'emotional-timeline' as const,
    gradient: 'from-indigo-900/50 to-purple-900/50',
  },
  {
    title: 'Energy Radar',
    description: 'Visualize energy across dimensions',
    size: '1x1' as const,
    chartType: 'energy-radar' as const,
    gradient: 'from-blue-900/50 to-cyan-900/50',
  },
  {
    title: 'Theme Cloud',
    description: 'See recurring themes and topics',
    size: '1x1' as const,
    chartType: 'theme-cloud' as const,
    gradient: 'from-purple-900/50 to-pink-900/50',
  },
  {
    title: 'GitHub-Style Heatmap',
    description: 'Your journaling consistency at a glance',
    size: '2x1' as const,
    chartType: 'heatmap' as const,
    gradient: 'from-green-900/50 to-emerald-900/50',
  },
  {
    title: 'Sankey Flow',
    description: 'Trace emotional transitions',
    size: '2x1' as const,
    chartType: 'sankey-flow' as const,
    gradient: 'from-orange-900/50 to-red-900/50',
  },
  {
    title: 'Mode Distribution',
    description: 'Balance of emotional states',
    size: '1x1' as const,
    chartType: 'mode-pie' as const,
    gradient: 'from-slate-800/50 to-slate-900/50',
  },
  {
    title: 'Sentiment Pulse',
    description: 'Real-time sentiment analysis',
    size: '1x1' as const,
    chartType: 'sentiment-pulse' as const,
    gradient: 'from-rose-900/50 to-pink-900/50',
  },
  {
    title: 'Contradiction Tracker',
    description: 'Identify internal conflicts',
    size: '2x1' as const,
    chartType: 'contradiction-tracker' as const,
    gradient: 'from-amber-900/50 to-orange-900/50',
  },
]

export function Features() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Decorative blurs - subtle colored orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/6 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header - Enhanced typography */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-subtle indicator-info mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">21 Visualizations</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-display tracking-tight">
            <span className="text-white-95">Visualize Your Mind</span>
            <br />
            <span className="gradient-text text-shadow-data">with Powerful Charts</span>
          </h2>

          <p className="text-lg md:text-xl text-white-70 leading-relaxed max-w-2xl mx-auto font-light">
            From emotional timelines to contradiction tracking, gain insights
            you&apos;ve never had before.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {charts.map((chart, index) => (
            <BentoCard
              key={chart.title}
              {...chart}
              index={index}
            />
          ))}
        </div>

        {/* CTA below grid */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white-60 mb-6">
            Plus <span className="text-primary font-semibold">13 more visualizations</span> in the full dashboard
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="glow">
              Start Journaling Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="glass">
              Explore All Charts
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
