import { motion } from 'framer-motion'
import { type StepConfig, STEPS, TEXT_STEP_INDICES } from '@/hooks/useStepScroll'

interface StepNavbarProps {
  currentStep: number
  totalSteps: number
  stepConfig: StepConfig
  isLocked: boolean
  onNavigate: (textStepIndex: number) => void
}

export function StepNavbar({ currentStep, totalSteps, stepConfig, isLocked, onNavigate }: StepNavbarProps) {
  // Get text step labels (only show text steps in progress)
  const textSteps = STEPS.filter(s => s.type === 'text')
  const currentTextStepIndex = textSteps.findIndex(s =>
    s.state === stepConfig.state && s.type === 'text'
  )

  // Calculate overall progress (0-100)
  const overallProgress = Math.round((currentStep / (totalSteps - 1)) * 100)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6"
      style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
      role="navigation"
      aria-label="Experience navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="text-white/80 font-medium hidden sm:block">Pratyaksha</span>
        </div>

        {/* Center - Section indicator */}
        <div className="flex flex-col items-center gap-2">
          {/* Current section label */}
          <motion.span
            key={stepConfig.label || 'transitioning'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/60 text-xs uppercase tracking-wider"
          >
            {stepConfig.type === 'animation' ? 'Transitioning...' : stepConfig.label}
          </motion.span>

          {/* Step progress dots - clickable with accessibility */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Experience sections"
          >
            {textSteps.map((step, idx) => {
              const isActive = currentTextStepIndex >= idx
              const isCurrent = currentTextStepIndex === idx && stepConfig.type === 'text'
              const stepIndex = TEXT_STEP_INDICES[idx]
              const canClick = !isLocked && stepIndex !== currentStep

              return (
                <div key={idx} className="flex items-center">
                  <motion.button
                    onClick={() => canClick && onNavigate(idx)}
                    disabled={isLocked}
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Go to ${step.label} section${isCurrent ? ' (current)' : ''}`}
                    tabIndex={canClick ? 0 : -1}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 touch-feedback focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent ${
                      isCurrent
                        ? 'bg-white scale-150'
                        : isActive
                          ? 'bg-white/60'
                          : 'bg-white/20'
                    } ${canClick ? 'cursor-pointer hover:scale-125 hover:bg-white/80' : 'cursor-default'}`}
                    animate={isCurrent ? { scale: [1.5, 1.8, 1.5] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    title={step.label}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        canClick && onNavigate(idx)
                      } else if (e.key === 'ArrowRight' && idx < textSteps.length - 1) {
                        e.preventDefault()
                        onNavigate(idx + 1)
                      } else if (e.key === 'ArrowLeft' && idx > 0) {
                        e.preventDefault()
                        onNavigate(idx - 1)
                      }
                    }}
                  />
                  {idx < textSteps.length - 1 && (
                    <div
                      className={`w-6 h-0.5 mx-1 transition-colors ${isActive ? 'bg-white/40' : 'bg-white/10'}`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right side - Progress percentage */}
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs font-mono">
            {overallProgress}%
          </span>

          {/* Lock indicator */}
          {isLocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-yellow-400/60"
            />
          )}
        </div>
      </div>

      {/* Full-width progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <motion.div
          className="h-full bg-white/30"
          style={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.nav>
  )
}
