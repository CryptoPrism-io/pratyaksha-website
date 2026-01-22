import { motion } from 'framer-motion'
import { BaseOverlay, AnimatedText, StaggerContainer, StaggerItem, GlassCard } from './BaseOverlay'
import { STATE_CONTENT, STATES, STATE_COLORS } from '@/lib/constants'
import { Brain, Heart, Tags, Lightbulb } from 'lucide-react'

interface SolutionOverlayProps {
  isVisible: boolean
}

const icons = {
  brain: Brain,
  heart: Heart,
  tags: Tags,
  lightbulb: Lightbulb,
}

export function SolutionOverlay({ isVisible }: SolutionOverlayProps) {
  const content = STATE_CONTENT[STATES.ORGANIZING]
  const color = STATE_COLORS[STATES.ORGANIZING]

  return (
    <BaseOverlay isVisible={isVisible}>
      <div className="flex flex-col items-center justify-start text-center px-4 sm:px-6 max-w-5xl mx-auto py-4">
        {/* Badge with glow */}
        <AnimatedText delay={0} animation="scaleIn">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm"
            style={{ backgroundColor: `${color.hex}20`, color: color.hex }}
            animate={{
              boxShadow: [
                `0 0 20px ${color.hex}30`,
                `0 0 40px ${color.hex}50`,
                `0 0 20px ${color.hex}30`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-4 h-4" />
            The 4-Agent Pipeline
          </motion.div>
        </AnimatedText>

        {/* Headline */}
        <AnimatedText delay={0.1} animation="pop">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
            {content.headline}
          </h2>
        </AnimatedText>

        {/* Subline */}
        <AnimatedText delay={0.15} animation="slideUp">
          <p className="text-base sm:text-xl text-white/70 mb-6 sm:mb-12 max-w-xl">
            {content.subline}
          </p>
        </AnimatedText>

        {/* Agent cards with stagger */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 w-full max-w-4xl"
          staggerDelay={0.1}
          initialDelay={0.2}
        >
          {content.agents?.map((agent, index) => {
            const Icon = icons[agent.icon as keyof typeof icons]
            return (
              <StaggerItem key={agent.name} animation="pop">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    transition: { type: 'spring', stiffness: 400 }
                  }}
                  className="h-full"
                >
                  <GlassCard className="text-center h-full relative overflow-hidden !p-3 sm:!p-6">
                    {/* Background pulse */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: color.hex }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.1, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    />

                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 sm:mb-4 flex items-center justify-center relative z-10"
                      style={{ backgroundColor: `${color.hex}20` }}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: color.hex }} />
                    </motion.div>
                    <h3 className="text-white font-semibold text-xs sm:text-sm mb-1 sm:mb-2 relative z-10">{agent.name}</h3>
                    <p className="text-white/60 text-[10px] sm:text-xs relative z-10">{agent.desc}</p>
                  </GlassCard>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Connection line */}
        <AnimatedText delay={0.6} animation="slideUp" className="mt-4 sm:mt-8">
          <motion.div
            className="flex items-center gap-2 text-white/40 text-sm"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-8 h-px bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
            <span>Working together in real-time</span>
            <motion.div
              className="w-8 h-px bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
          </motion.div>
        </AnimatedText>
      </div>
    </BaseOverlay>
  )
}
