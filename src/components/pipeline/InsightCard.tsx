'use client'

import { motion } from 'framer-motion'
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InsightCardProps {
  isActive: boolean
}

export function InsightCard({ isActive }: InsightCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 30,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 blur-xl rounded-2xl" />

      <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white flex items-center gap-2">
              Next Action
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h4>
            <p className="text-xs text-muted-foreground">AI-generated suggestion</p>
          </div>
        </div>

        {/* Insight content */}
        <div className="space-y-4">
          <p className="text-lg text-gray-200 leading-relaxed">
            "Try the <span className="text-emerald-400 font-medium">5-minute rule</span>: commit to just 5 minutes of preparation. Often, starting is the hardest part."
          </p>

          {/* Supporting context */}
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-muted-foreground">
              Based on: Avoidance pattern
            </span>
            <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-muted-foreground">
              CBT Technique: Behavioral Activation
            </span>
          </div>

          {/* Action button */}
          <Button
            size="sm"
            className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
          >
            Mark as done
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
      </div>
    </motion.div>
  )
}
