import { useState, useEffect, useMemo } from 'react'
import { MotionValue } from 'framer-motion'

export type ScrollPhase =
  | 'chaos'      // 0-15%
  | 'journal'    // 15-30%
  | 'intent'     // 30-42%
  | 'emotion'    // 42-54%
  | 'theme'      // 54-66%
  | 'insight'    // 66-78%
  | 'clarity'    // 78-100%

export interface PhaseConfig {
  id: ScrollPhase
  name: string
  title: string
  subtitle: string
  description: string
  color: string
  startPercent: number
  endPercent: number
}

export const PHASES: PhaseConfig[] = [
  {
    id: 'chaos',
    name: 'Chaos',
    title: 'Your mind.',
    subtitle: 'Overwhelmed.',
    description: 'Scattered. Lost in the noise.',
    color: '#EF4444',
    startPercent: 0,
    endPercent: 0.15,
  },
  {
    id: 'journal',
    name: 'The Journal',
    title: 'You start writing.',
    subtitle: 'Thoughts become words.',
    description: 'Words become clarity.',
    color: '#3B82F6',
    startPercent: 0.15,
    endPercent: 0.30,
  },
  {
    id: 'intent',
    name: 'Intent Agent',
    title: 'Understanding',
    subtitle: 'what you\'re really saying.',
    description: 'Classifying your thoughts into meaning.',
    color: '#3B82F6',
    startPercent: 0.30,
    endPercent: 0.42,
  },
  {
    id: 'emotion',
    name: 'Emotion Agent',
    title: 'Feeling',
    subtitle: 'what you\'re feeling.',
    description: 'Reading between the lines.',
    color: '#EC4899',
    startPercent: 0.42,
    endPercent: 0.54,
  },
  {
    id: 'theme',
    name: 'Theme Agent',
    title: 'Connecting',
    subtitle: 'the dots you couldn\'t see.',
    description: 'Finding patterns in your thoughts.',
    color: '#8B5CF6',
    startPercent: 0.54,
    endPercent: 0.66,
  },
  {
    id: 'insight',
    name: 'Insight Agent',
    title: 'Your breakthrough',
    subtitle: 'moment.',
    description: 'Actionable clarity from chaos.',
    color: '#10B981',
    startPercent: 0.66,
    endPercent: 0.78,
  },
  {
    id: 'clarity',
    name: 'Clarity',
    title: 'See Your Mind.',
    subtitle: 'Clearly.',
    description: 'Join the waitlist for early access.',
    color: '#F59E0B',
    startPercent: 0.78,
    endPercent: 1.0,
  },
]

export interface ScrollPhaseState {
  currentPhase: ScrollPhase
  phaseIndex: number
  phaseProgress: number // 0-1 within current phase
  globalProgress: number // 0-1 overall
  isTransitioning: boolean
  transitionProgress: number
  phaseConfig: PhaseConfig
  nextPhase: PhaseConfig | null
  prevPhase: PhaseConfig | null
}

export function useScrollPhase(scrollProgress: MotionValue<number>): ScrollPhaseState {
  const [state, setState] = useState<ScrollPhaseState>({
    currentPhase: 'chaos',
    phaseIndex: 0,
    phaseProgress: 0,
    globalProgress: 0,
    isTransitioning: false,
    transitionProgress: 0,
    phaseConfig: PHASES[0],
    nextPhase: PHASES[1],
    prevPhase: null,
  })

  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (progress) => {
      // Find current phase
      let phaseIndex = 0
      for (let i = 0; i < PHASES.length; i++) {
        if (progress >= PHASES[i].startPercent && progress < PHASES[i].endPercent) {
          phaseIndex = i
          break
        }
        if (i === PHASES.length - 1) {
          phaseIndex = i // Last phase
        }
      }

      const currentPhaseConfig = PHASES[phaseIndex]
      const phaseDuration = currentPhaseConfig.endPercent - currentPhaseConfig.startPercent
      const phaseProgress = (progress - currentPhaseConfig.startPercent) / phaseDuration

      // Detect transition zones (within 5% of phase boundaries)
      const transitionThreshold = 0.05
      const distanceToEnd = currentPhaseConfig.endPercent - progress
      const distanceToStart = progress - currentPhaseConfig.startPercent
      const isTransitioning = distanceToEnd < transitionThreshold || distanceToStart < transitionThreshold

      let transitionProgress = 0
      if (distanceToEnd < transitionThreshold) {
        transitionProgress = 1 - (distanceToEnd / transitionThreshold)
      } else if (distanceToStart < transitionThreshold) {
        transitionProgress = 1 - (distanceToStart / transitionThreshold)
      }

      setState({
        currentPhase: currentPhaseConfig.id,
        phaseIndex,
        phaseProgress: Math.max(0, Math.min(1, phaseProgress)),
        globalProgress: progress,
        isTransitioning,
        transitionProgress,
        phaseConfig: currentPhaseConfig,
        nextPhase: PHASES[phaseIndex + 1] || null,
        prevPhase: PHASES[phaseIndex - 1] || null,
      })
    })

    return () => unsubscribe()
  }, [scrollProgress])

  return state
}

// Utility to interpolate between phase colors
export function interpolatePhaseColor(
  progress: number,
  fromPhase: PhaseConfig,
  toPhase: PhaseConfig | null
): string {
  if (!toPhase) return fromPhase.color

  const phaseDuration = fromPhase.endPercent - fromPhase.startPercent
  const phaseProgress = (progress - fromPhase.startPercent) / phaseDuration

  // Only interpolate in the last 20% of the phase
  if (phaseProgress < 0.8) return fromPhase.color

  const t = (phaseProgress - 0.8) / 0.2

  // Simple hex color interpolation
  const from = parseInt(fromPhase.color.slice(1), 16)
  const to = parseInt(toPhase.color.slice(1), 16)

  const r = Math.round(((from >> 16) & 255) * (1 - t) + ((to >> 16) & 255) * t)
  const g = Math.round(((from >> 8) & 255) * (1 - t) + ((to >> 8) & 255) * t)
  const b = Math.round((from & 255) * (1 - t) + (to & 255) * t)

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// Get chaos level for each phase
export function getPhaseChaos(phase: ScrollPhase, phaseProgress: number): number {
  const baseChaos: Record<ScrollPhase, number> = {
    chaos: 1.5,
    journal: 0.8,
    intent: 0.4,
    emotion: 0.3,
    theme: 0.2,
    insight: 0.5,
    clarity: 0.1,
  }

  // Spike chaos during transitions
  const transitionSpike = phaseProgress > 0.9 ? (phaseProgress - 0.9) * 10 : 0

  return baseChaos[phase] + transitionSpike * 0.5
}
