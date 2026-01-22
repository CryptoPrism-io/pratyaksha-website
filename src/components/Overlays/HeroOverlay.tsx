import { motion } from 'framer-motion'
import { BaseOverlay, TextReveal, AnimatedText } from './BaseOverlay'
import { STATE_CONTENT, STATES } from '@/lib/constants'

interface HeroOverlayProps {
  isVisible: boolean
}

export function HeroOverlay({ isVisible }: HeroOverlayProps) {
  const content = STATE_CONTENT[STATES.DORMANT]

  return (
    <BaseOverlay isVisible={isVisible}>
      <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Headline with word-by-word reveal */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
        >
          <TextReveal text={content.headline} delay={0} />
        </motion.h1>

        {/* Subline with pop animation */}
        <AnimatedText delay={0.3} animation="slideUp">
          <p className="text-base sm:text-xl md:text-2xl text-white/70 max-w-2xl">
            {content.subline}
          </p>
        </AnimatedText>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: `${20 + i * 15}%`,
                y: '100%',
                opacity: 0,
              }}
              animate={{
                y: '-10%',
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </div>
    </BaseOverlay>
  )
}
