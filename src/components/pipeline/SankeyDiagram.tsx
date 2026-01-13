'use client'

import { motion } from 'framer-motion'

interface SankeyDiagramProps {
  isActive: boolean
  progress: number
}

export function SankeyDiagram({ isActive, progress }: SankeyDiagramProps) {
  return (
    <div className="relative h-48 w-full">
      {/* Left side - Action */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 border border-emerald-500/50 flex items-center justify-center">
            <span className="text-2xl">💪</span>
          </div>
          <span className="text-sm font-medium text-emerald-400">Action</span>
          <span className="text-xs text-muted-foreground">"push through"</span>
        </div>
      </motion.div>

      {/* Right side - Fear */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500/30 to-rose-600/30 border border-rose-500/50 flex items-center justify-center">
            <span className="text-2xl">😰</span>
          </div>
          <span className="text-sm font-medium text-rose-400">Fear</span>
          <span className="text-xs text-muted-foreground">"avoid"</span>
        </div>
      </motion.div>

      {/* Center - Contradiction indicator */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-500/50 flex items-center justify-center animate-pulse">
            <span className="text-lg">⚡</span>
          </div>
          <span className="text-xs font-medium text-amber-400">Tension</span>
        </div>
      </motion.div>

      {/* Flow lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
        {/* Left to center flow */}
        <motion.path
          d="M 80 100 Q 150 60 200 100"
          fill="none"
          stroke="url(#greenGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? progress : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Right to center flow */}
        <motion.path
          d="M 320 100 Q 250 140 200 100"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? progress : 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />

        {/* Animated particles on the paths */}
        {isActive && (
          <>
            <motion.circle
              r="4"
              fill="#10B981"
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ offsetPath: 'path("M 80 100 Q 150 60 200 100")' }}
            />
            <motion.circle
              r="4"
              fill="#EF4444"
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              style={{ offsetPath: 'path("M 320 100 Q 250 140 200 100")' }}
            />
          </>
        )}

        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="redGradient" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Contradiction label */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300">
          Contradiction: Action vs. Fear
        </span>
      </motion.div>
    </div>
  )
}
