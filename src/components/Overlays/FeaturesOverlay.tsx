import { motion } from 'framer-motion'
import { BaseOverlay, AnimatedText, StaggerContainer, StaggerItem, GlassCard } from './BaseOverlay'
import { STATE_CONTENT, STATES, STATE_COLORS } from '@/lib/constants'
import { Activity, Target, AlertTriangle, Flame } from 'lucide-react'

interface FeaturesOverlayProps {
  isVisible: boolean
}

const featureIcons = [Activity, Target, AlertTriangle, Flame]

export function FeaturesOverlay({ isVisible }: FeaturesOverlayProps) {
  const content = STATE_CONTENT[STATES.ILLUMINATED]
  const color = STATE_COLORS[STATES.ILLUMINATED]

  return (
    <BaseOverlay isVisible={isVisible}>
      <div className="flex flex-col items-center justify-start text-center px-4 sm:px-6 max-w-5xl mx-auto py-4">
        {/* Badge */}
        <AnimatedText delay={0} animation="scaleIn">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm"
            style={{ backgroundColor: `${color.hex}20`, color: color.hex }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Activity className="w-4 h-4" />
            </motion.div>
            21 Visualizations
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

        {/* Feature cards */}
        <StaggerContainer
          className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-3xl"
          staggerDelay={0.1}
          initialDelay={0.2}
        >
          {content.features?.map((feature, index) => {
            const Icon = featureIcons[index]
            const isLarge = index === 0 || index === 3

            return (
              <StaggerItem
                key={feature.name}
                animation="pop"
                className={isLarge ? 'col-span-1' : ''}
              >
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 400 }
                  }}
                  className="h-full"
                >
                  <GlassCard className="text-left h-full hover:bg-white/5 transition-colors !p-3 sm:!p-6">
                    <div className="flex items-start gap-2 sm:gap-4">
                      <motion.div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${color.hex}20` }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: color.hex }} />
                      </motion.div>
                      <div>
                        <h3 className="text-white font-semibold text-xs sm:text-base mb-0.5 sm:mb-1">{feature.name}</h3>
                        <p className="text-white/60 text-[10px] sm:text-sm">{feature.desc}</p>
                      </div>
                    </div>

                    {/* Animated bars for large cards */}
                    {isLarge && <AnimatedBars color={color.hex} />}
                  </GlassCard>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Footer */}
        <AnimatedText delay={0.6} animation="slideUp" className="mt-3 sm:mt-6">
          <p className="text-white/40 text-xs sm:text-sm">
            + 17 more visualizations in the full dashboard
          </p>
        </AnimatedText>
      </div>
    </BaseOverlay>
  )
}

function AnimatedBars({ color }: { color: string }) {
  const barHeights = [40, 65, 45, 80, 55, 70, 60]

  return (
    <div className="mt-2 sm:mt-4 h-10 sm:h-16 bg-white/5 rounded-lg flex items-end justify-around px-2 pb-1 sm:pb-2">
      {barHeights.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 sm:w-2 rounded-t"
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{
            delay: 0.5 + i * 0.08,
            duration: 0.6,
            type: 'spring',
            stiffness: 200,
          }}
          style={{
            backgroundColor: color,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  )
}
