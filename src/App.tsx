import { useStepScroll, STEPS } from '@/hooks/useStepScroll'
import { StepFramePlayer } from '@/components/BrainScene/StepFramePlayer'
import { StepNavbar } from '@/components/Navigation/StepNavbar'
import {
  HeroOverlay,
  ProblemOverlay,
  SolutionOverlay,
  FeaturesOverlay,
  CTAOverlay,
} from '@/components/Overlays'
import { STATES } from '@/lib/constants'

function App() {
  const { currentStep, stepConfig, animationProgress, isAnimating, isLocked, totalSteps, direction, navigateToTextStep } = useStepScroll()

  // Determine which text overlay to show (only during text steps)
  const showHero = stepConfig.type === 'text' && stepConfig.state === STATES.DORMANT
  const showProblem = stepConfig.type === 'text' && stepConfig.state === STATES.CHAOS
  const showSolution = stepConfig.type === 'text' && stepConfig.state === STATES.ORGANIZING
  const showFeatures = stepConfig.type === 'text' && stepConfig.state === STATES.ILLUMINATED
  const showCTA = stepConfig.type === 'text' && stepConfig.state === STATES.RADIANT

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Step-based frame player */}
      <StepFramePlayer
        currentStep={currentStep}
        stepConfig={stepConfig}
        animationProgress={animationProgress}
        isAnimating={isAnimating}
        direction={direction}
      />

      {/* Top navigation with step progress */}
      <StepNavbar
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepConfig={stepConfig}
        isLocked={isLocked}
        onNavigate={navigateToTextStep}
      />

      {/* Content overlays - only visible during text steps */}
      <HeroOverlay isVisible={showHero} />
      <ProblemOverlay isVisible={showProblem} />
      <SolutionOverlay isVisible={showSolution} />
      <FeaturesOverlay isVisible={showFeatures} />
      <CTAOverlay isVisible={showCTA} />

      {/* Enhanced scroll hint with safe area support */}
      {stepConfig.type === 'text' && !isLocked && currentStep < totalSteps - 1 && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-40 flex flex-col items-center text-white/50 scroll-hint"
          style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <span className="text-xs sm:text-sm mb-2 tracking-widest uppercase">
            {currentStep === 0 ? 'Scroll to explore' : 'Continue'}
          </span>
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" />
            </svg>
            <svg className="w-5 h-5 -mt-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Debug info (remove in production) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/70 backdrop-blur px-4 py-2 rounded-lg text-xs text-white/60 font-mono">
          <div>Step: {currentStep + 1} / {totalSteps}</div>
          <div>Type: {stepConfig.type}</div>
          <div>State: {['Dormant', 'Chaos', 'Organizing', 'Illuminated', 'Radiant'][stepConfig.state]}</div>
          {isAnimating && <div>Animation: {(animationProgress * 100).toFixed(0)}%</div>}
          {isLocked && <div className="text-yellow-400">Locked</div>}
        </div>
      )}
    </div>
  )
}

export default App
