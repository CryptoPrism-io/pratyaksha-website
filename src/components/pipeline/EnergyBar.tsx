'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnergyBarProps {
  level: number // 0-10
  label: string
  isActive: boolean
}

export function EnergyBar({ level, label, isActive }: EnergyBarProps) {
  const percentage = (level / 10) * 100

  // Color based on energy level
  const getColor = () => {
    if (level <= 3) return 'from-gray-500 to-gray-400'
    if (level <= 5) return 'from-amber-500 to-amber-400'
    if (level <= 7) return 'from-emerald-500 to-emerald-400'
    return 'from-rose-500 to-rose-400'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono text-white">{level}/10</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            getColor()
          )}
          initial={{ width: 0 }}
          animate={{ width: isActive ? `${percentage}%` : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {/* Markers */}
      <div className="flex justify-between px-1">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-1 h-1 rounded-full transition-colors duration-300',
              i < level && isActive ? 'bg-white/60' : 'bg-white/20'
            )}
          />
        ))}
      </div>
    </div>
  )
}

interface ModeDisplayProps {
  mode: string
  subMode?: string
  isActive: boolean
}

export function ModeDisplay({ mode, subMode, isActive }: ModeDisplayProps) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
        <span className="font-medium text-white">{mode}</span>
      </div>
      {subMode && (
        <>
          <span className="text-muted-foreground">→</span>
          <span className="text-muted-foreground">{subMode}</span>
        </>
      )}
    </motion.div>
  )
}

interface EnergyShapeProps {
  shape: 'flat' | 'rising' | 'falling' | 'chaotic' | 'centered'
  isActive: boolean
}

export function EnergyShape({ shape, isActive }: EnergyShapeProps) {
  const getPath = () => {
    switch (shape) {
      case 'flat':
        return 'M 0 50 L 100 50'
      case 'rising':
        return 'M 0 80 Q 50 40 100 20'
      case 'falling':
        return 'M 0 20 Q 50 40 100 80'
      case 'chaotic':
        return 'M 0 50 Q 20 20 40 60 Q 60 80 80 30 Q 90 50 100 40'
      case 'centered':
        return 'M 0 50 Q 25 30 50 50 Q 75 70 100 50'
      default:
        return 'M 0 50 L 100 50'
    }
  }

  const shapeLabels = {
    flat: 'Flat',
    rising: 'Rising',
    falling: 'Falling',
    chaotic: 'Chaotic',
    centered: 'Centered',
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Energy Shape</span>
        <span className="text-sm font-medium text-white">{shapeLabels[shape]}</span>
      </div>
      <div className="h-16 bg-white/5 rounded-lg p-2">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d={getPath()}
            fill="none"
            stroke="url(#energyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isActive ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
