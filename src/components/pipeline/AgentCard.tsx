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
  intent: {
    bg: 'from-blue-500/15 to-blue-600/15',
    border: 'rgba(59, 130, 246, 0.4)',
    glow: '0 0 20px rgba(59, 130, 246, 0.2), 0 0 40px rgba(59, 130, 246, 0.1)',
    iconBg: 'from-blue-500/25 to-blue-600/25'
  },
  emotion: {
    bg: 'from-rose-500/15 to-rose-600/15',
    border: 'rgba(244, 63, 94, 0.4)',
    glow: '0 0 20px rgba(244, 63, 94, 0.2), 0 0 40px rgba(244, 63, 94, 0.1)',
    iconBg: 'from-rose-500/25 to-rose-600/25'
  },
  theme: {
    bg: 'from-purple-500/15 to-purple-600/15',
    border: 'rgba(168, 85, 247, 0.4)',
    glow: '0 0 20px rgba(168, 85, 247, 0.2), 0 0 40px rgba(168, 85, 247, 0.1)',
    iconBg: 'from-purple-500/25 to-purple-600/25'
  },
  insight: {
    bg: 'from-emerald-500/15 to-emerald-600/15',
    border: 'rgba(16, 185, 129, 0.4)',
    glow: '0 0 20px rgba(16, 185, 129, 0.2), 0 0 40px rgba(16, 185, 129, 0.1)',
    iconBg: 'from-emerald-500/25 to-emerald-600/25'
  },
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
        'rounded-3xl p-6 transition-all duration-300',
        isActive
          ? `bg-gradient-to-br ${colors.bg}`
          : 'bg-black/10 opacity-50 hover:opacity-70'
      )}
      style={{
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: isActive ? `1px solid ${colors.border}` : '0.5px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isActive
          ? `${colors.glow}, 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isActive ? 1 : 0.5,
        y: 0,
        scale: isActive ? 1 : 0.98,
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500',
            isActive ? `bg-gradient-to-br ${colors.iconBg}` : 'bg-white/5'
          )}
          style={{
            boxShadow: isActive ? `inset 0 1px 0 rgba(255, 255, 255, 0.15)` : undefined,
          }}
        >
          <Icon className={cn(
            'w-6 h-6 transition-all duration-500',
            isActive ? 'text-white' : 'text-gray-500'
          )} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white-95 font-display">{name}</h3>
          <p className="text-sm text-white-60">{description}</p>
        </div>
        {isActive && (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center glass-subtle"
            style={{ borderColor: colors.border }}
          >
            <span className="text-xs font-bold text-white-95 font-data">{Math.round(progress * 100)}%</span>
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
