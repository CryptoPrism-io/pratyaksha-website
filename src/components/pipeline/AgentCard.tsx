'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Brain, Heart, GitBranch, Lightbulb } from 'lucide-react'

const agentIcons = {
  intent: Brain,
  emotion: Heart,
  theme: GitBranch,
  insight: Lightbulb,
}

const agentColors = {
  intent: { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/50', glow: 'shadow-blue-500/20' },
  emotion: { bg: 'from-rose-500/20 to-rose-600/20', border: 'border-rose-500/50', glow: 'shadow-rose-500/20' },
  theme: { bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/50', glow: 'shadow-purple-500/20' },
  insight: { bg: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/50', glow: 'shadow-emerald-500/20' },
}

interface AgentCardProps {
  agent: 'intent' | 'emotion' | 'theme' | 'insight'
  name: string
  description: string
  isActive: boolean
  progress: number
  children: React.ReactNode
}

export function AgentCard({ agent, name, description, isActive, progress, children }: AgentCardProps) {
  const Icon = agentIcons[agent]
  const colors = agentColors[agent]

  return (
    <motion.div
      className={cn(
        'rounded-2xl p-6 backdrop-blur-lg border transition-colors duration-300',
        isActive
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : 'bg-white/5 border-white/10 opacity-40 hover:bg-white/8 hover:border-white/15'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isActive ? 1 : 0.4,
        y: 0,
        scale: isActive ? 1 : 0.98,
      }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center transition-[background-image,background-color] duration-500',
          isActive ? `bg-gradient-to-br ${colors.bg}` : 'bg-white/5'
        )}>
          <Icon className={cn(
            'w-6 h-6 transition-colors duration-500',
            isActive ? 'text-white animate-pulse' : 'text-gray-500'
          )} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {isActive && (
          <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{Math.round(progress * 100)}%</span>
          </div>
        )}
      </div>
      <div className={cn(
        'transition-[opacity,max-height] duration-500 overflow-hidden',
        isActive ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
      )}>
        {children}
      </div>
    </motion.div>
  )
}
