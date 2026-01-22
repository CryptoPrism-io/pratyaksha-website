import { motion } from 'framer-motion'
import { BaseOverlay, AnimatedText, GlassCard } from './BaseOverlay'
import { STATE_CONTENT, STATES, STATE_COLORS } from '@/lib/constants'
import { BarChart3, PieChart, Tags, TrendingUp } from 'lucide-react'
import { DemoModeChart, DemoTimelineChart, DemoThemeCloud, DemoActivityChart } from '@/components/DemoCharts'

interface FeaturesOverlayProps {
  isVisible: boolean
}

// Chart cards configuration
const CHART_CARDS = [
  {
    id: 'modes',
    title: 'Cognitive Modes',
    description: 'Track your mental states',
    icon: PieChart,
    Chart: DemoModeChart,
  },
  {
    id: 'timeline',
    title: 'Emotional Timeline',
    description: 'See your journey unfold',
    icon: TrendingUp,
    Chart: DemoTimelineChart,
  },
  {
    id: 'themes',
    title: 'Theme Patterns',
    description: 'Discover recurring themes',
    icon: Tags,
    Chart: DemoThemeCloud,
  },
  {
    id: 'activity',
    title: 'Daily Rhythm',
    description: 'Your journaling habits',
    icon: BarChart3,
    Chart: DemoActivityChart,
  },
]

export function FeaturesOverlay({ isVisible }: FeaturesOverlayProps) {
  const content = STATE_CONTENT[STATES.ILLUMINATED]
  const color = STATE_COLORS[STATES.ILLUMINATED]

  return (
    <BaseOverlay isVisible={isVisible}>
      <div className="flex flex-col items-center justify-start text-center px-4 sm:px-6 max-w-5xl mx-auto py-4">
        {/* Badge */}
        <AnimatedText delay={0} animation="scaleIn">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-5 text-xs sm:text-sm"
            style={{ backgroundColor: `${color.hex}20`, color: color.hex }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <BarChart3 className="w-4 h-4" />
            </motion.div>
            21 Visualizations
          </motion.div>
        </AnimatedText>

        {/* Headline */}
        <AnimatedText delay={0.1} animation="pop">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            {content.headline}
          </h2>
        </AnimatedText>

        {/* Subline */}
        <AnimatedText delay={0.15} animation="slideUp">
          <p className="text-sm sm:text-lg text-white/70 mb-4 sm:mb-6 max-w-lg">
            {content.subline}
          </p>
        </AnimatedText>

        {/* Chart cards - 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-2xl">
          {CHART_CARDS.map((card, index) => {
            const Icon = card.icon
            const Chart = card.Chart

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <GlassCard className="h-full !p-2 sm:!p-3 hover:bg-white/5 transition-colors group">
                  {/* Header */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color.hex}20` }}
                    >
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: color.hex }} />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="text-white font-medium text-[10px] sm:text-xs leading-tight truncate">
                        {card.title}
                      </h3>
                      <p className="text-white/50 text-[8px] sm:text-[10px] leading-tight truncate">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Chart container */}
                  <div className="h-20 sm:h-28 w-full rounded bg-white/5 overflow-hidden">
                    {isVisible && <Chart animate={true} />}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <AnimatedText delay={0.6} animation="slideUp" className="mt-3 sm:mt-4">
          <p className="text-white/40 text-[10px] sm:text-xs">
            + 17 more visualizations in the full dashboard
          </p>
        </AnimatedText>
      </div>
    </BaseOverlay>
  )
}
