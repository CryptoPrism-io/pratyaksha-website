import { motion } from 'framer-motion'
import { BaseOverlay, AnimatedText, StaggerContainer, StaggerItem, GlassCard } from './BaseOverlay'
import { STATE_CONTENT, STATES, STATE_COLORS } from '@/lib/constants'
import { AlertCircle } from 'lucide-react'

interface ProblemOverlayProps {
  isVisible: boolean
}

export function ProblemOverlay({ isVisible }: ProblemOverlayProps) {
  const content = STATE_CONTENT[STATES.CHAOS]
  const color = STATE_COLORS[STATES.CHAOS]

  return (
    <BaseOverlay isVisible={isVisible}>
      <div className="flex flex-col items-center justify-start text-center px-4 sm:px-6 max-w-4xl mx-auto py-4">
        {/* Animated icon */}
        <AnimatedText delay={0} animation="scaleIn">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-8"
            style={{ backgroundColor: `${color.hex}20` }}
            animate={{
              boxShadow: [
                `0 0 0 0 ${color.hex}40`,
                `0 0 0 20px ${color.hex}00`,
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: color.hex }} />
          </motion.div>
        </AnimatedText>

        {/* Headline */}
        <AnimatedText delay={0.1} animation="pop">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-6">
            {content.headline}
          </h2>
        </AnimatedText>

        {/* Subline */}
        <AnimatedText delay={0.2} animation="slideUp">
          <p className="text-base sm:text-xl text-white/70 mb-6 sm:mb-10 max-w-xl">
            {content.subline}
          </p>
        </AnimatedText>

        {/* Problem points with stagger */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl"
          staggerDelay={0.08}
          initialDelay={0.3}
        >
          {content.features?.map((feature, index) => (
            <StaggerItem key={index} animation="pop">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <GlassCard className="text-left !p-3 sm:!p-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <motion.div
                      className="w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <p className="text-white/80 text-xs sm:text-sm">{feature}</p>
                  </div>
                </GlassCard>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </BaseOverlay>
  )
}
