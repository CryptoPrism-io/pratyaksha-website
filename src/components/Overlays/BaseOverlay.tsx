import { ReactNode } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BaseOverlayProps {
  isVisible: boolean
  children: ReactNode
  className?: string
}

export function BaseOverlay({ isVisible, children, className }: BaseOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <>
          {/* Animated backdrop blur - starts first */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[9] bg-black/30"
            style={{ WebkitBackdropFilter: 'blur(12px)' }}
          />
          {/* Content overlay - no delay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn('overlay-container content-overlay', className)}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Pop animation variants
const popVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 30,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    filter: 'blur(5px)',
    transition: { duration: 0.2 },
  },
}

// Slide up with spring
const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
}

// Scale in from center
const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
}

// Fade in with slight rotation
const rotateInVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateX: -15,
    y: 20,
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 20,
    },
  },
}

type AnimationType = 'pop' | 'slideUp' | 'scaleIn' | 'rotateIn'

const variantMap: Record<AnimationType, Variants> = {
  pop: popVariants,
  slideUp: slideUpVariants,
  scaleIn: scaleInVariants,
  rotateIn: rotateInVariants,
}

// Creative animated text component with multiple animation types
export function AnimatedText({
  children,
  delay = 0,
  className,
  animation = 'pop',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  animation?: AnimationType
  style?: React.CSSProperties
}) {
  const variants = variantMap[animation]

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay }}
      className={className}
      style={{ perspective: 1000, ...style }}
    >
      {children}
    </motion.div>
  )
}

// Staggered container for children animations
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Child item for staggered animations
export function StaggerItem({
  children,
  className,
  animation = 'pop',
}: {
  children: ReactNode
  className?: string
  animation?: AnimationType
}) {
  const variants = variantMap[animation]

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}

// Glass card component with better contrast
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('glass-card-dark p-6', className)}>
      {children}
    </div>
  )
}

// Animated glass card with hover effects
export function AnimatedGlassCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      className={cn('glass-card-dark p-6', className)}
    >
      {children}
    </motion.div>
  )
}

// Text reveal animation (word by word)
export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(' ')

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
              },
            },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
