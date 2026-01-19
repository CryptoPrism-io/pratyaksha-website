'use client'

import { motion } from 'framer-motion'
import { Quote, Sparkles } from 'lucide-react'

interface TestimonialProps {
  quote: string
  outcome: string
  badge: string
}

const testimonials: TestimonialProps[] = [
  {
    quote:
      "Helped me spot anxiety triggers I missed for months. Now I can prepare for difficult situations before they overwhelm me.",
    outcome: 'Spotting Anxiety Triggers',
    badge: 'Pattern Recognition',
  },
  {
    quote:
      "The contradiction tracker showed patterns my therapist confirmed. Finally, objective data about my thinking patterns.",
    outcome: 'Pattern Clarity',
    badge: 'Therapist Confirmed',
  },
  {
    quote:
      "I've journaled for years but never saw the energy patterns. Pratyaksha showed me my 'productive' days had the worst outcomes.",
    outcome: 'Energy Insights',
    badge: 'Surprising Discovery',
  },
]

function TestimonialCard({ quote, outcome, badge }: TestimonialProps) {
  return (
    <motion.div
      className="glass-card p-6 rounded-2xl relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Quote icon */}
      <div className="absolute top-4 right-4 text-primary/20">
        <Quote className="w-8 h-8" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Outcome title */}
        <h3 className="text-lg font-semibold text-white mb-3">{outcome}</h3>

        {/* Quote */}
        <p className="text-muted-foreground mb-4 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-muted-foreground">
            — Anonymous Beta Tester
          </span>
          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {badge}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  return (
    <section className="py-24 bg-black/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-black/50 to-slate-950/50" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Beta Feedback</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real Results from Beta Testers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Anonymous feedback from early users who discovered new patterns in their thinking
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.outcome}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
