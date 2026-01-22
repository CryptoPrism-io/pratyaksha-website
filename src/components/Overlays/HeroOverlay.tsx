import { motion } from 'framer-motion'
import { BaseOverlay, AnimatedText } from './BaseOverlay'

interface HeroOverlayProps {
  isVisible: boolean
}

// Particle configuration for ambient effect
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
}))

// Floating orbs for depth
const ORBS = [
  { size: 200, x: '15%', y: '20%', color: 'rgba(147, 51, 234, 0.1)', blur: 80 },
  { size: 150, x: '80%', y: '70%', color: 'rgba(59, 130, 246, 0.1)', blur: 60 },
  { size: 100, x: '70%', y: '25%', color: 'rgba(236, 72, 153, 0.08)', blur: 50 },
]

export function HeroOverlay({ isVisible }: HeroOverlayProps) {
  return (
    <BaseOverlay isVisible={isVisible}>
      <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto relative">

        {/* Ambient floating orbs */}
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Sanskrit title with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-2 sm:mb-4"
        >
          {/* Glow effect behind text */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-purple-500/50">
              प्रत्यक्ष
            </span>
          </motion.div>

          {/* Main Sanskrit text */}
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white relative"
            style={{ fontFamily: 'serif' }}
            animate={{
              textShadow: [
                '0 0 20px rgba(255,255,255,0.3)',
                '0 0 40px rgba(255,255,255,0.5)',
                '0 0 20px rgba(255,255,255,0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            प्रत्यक्ष
          </motion.h1>
        </motion.div>

        {/* English transliteration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <span className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light tracking-[0.3em] uppercase">
            Pratyaksha
          </span>
        </motion.div>

        {/* Meaning/tagline */}
        <AnimatedText delay={0.5} animation="slideUp">
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-md mb-4 italic">
            "Direct Perception"
          </p>
        </AnimatedText>

        {/* Subline description */}
        <AnimatedText delay={0.7} animation="slideUp">
          <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-xl">
            See your mind clearly. Understand your patterns. Transform your thoughts.
          </p>
        </AnimatedText>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 sm:mt-12 w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Radial glow at center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </BaseOverlay>
  )
}
