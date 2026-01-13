'use client'

import { motion } from 'framer-motion'
import { PhaseConfig } from '@/hooks/useScrollPhase'

interface ProgressIndicatorProps {
  phases: PhaseConfig[]
  currentPhaseIndex: number
  phaseProgress: number
}

export function ProgressIndicator({
  phases,
  currentPhaseIndex,
  phaseProgress,
}: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {phases.map((phase, index) => {
        const isActive = index === currentPhaseIndex
        const isPast = index < currentPhaseIndex
        const isFuture = index > currentPhaseIndex

        return (
          <div key={phase.id} className="relative group">
            {/* Connection line to next */}
            {index < phases.length - 1 && (
              <div
                className="absolute left-1/2 top-full w-0.5 h-2 -translate-x-1/2"
                style={{
                  backgroundColor: isPast ? phase.color : 'rgba(255,255,255,0.1)',
                }}
              />
            )}

            {/* Dot */}
            <motion.div
              className="relative w-3 h-3 rounded-full cursor-pointer"
              style={{
                backgroundColor: isActive || isPast ? phase.color : 'rgba(255,255,255,0.2)',
              }}
              animate={{
                scale: isActive ? 1.5 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Active ring */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ borderColor: phase.color }}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Progress fill for active phase */}
              {isActive && (
                <svg
                  className="absolute -inset-1"
                  viewBox="0 0 20 20"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke={phase.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={50.27}
                    strokeDashoffset={50.27 * (1 - phaseProgress)}
                    transform="rotate(-90 10 10)"
                  />
                </svg>
              )}
            </motion.div>

            {/* Tooltip */}
            <div
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `${phase.color}20`,
                  color: phase.color,
                  border: `1px solid ${phase.color}30`,
                }}
              >
                {phase.name}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
