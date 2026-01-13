'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import dynamic from 'next/dynamic'

const ImmersiveBrain = dynamic(
  () => import('@/components/3d/ImmersiveBrain').then((mod) => mod.ImmersiveBrain),
  { ssr: false }
)

interface Section {
  id: string
  title: string
  subtitle: string
  description: string
  brainState: 'idle' | 'analyzing' | 'processing' | 'insight' | 'glow'
  color: string
  accentElements?: React.ReactNode
}

const sections: Section[] = [
  {
    id: 'hero',
    title: 'Your Mind,',
    subtitle: 'Visualized.',
    description: 'AI-powered cognitive journaling that reveals patterns you\'ve never seen before.',
    brainState: 'idle',
    color: '#6366F1',
  },
  {
    id: 'pipeline',
    title: '4-Agent',
    subtitle: 'AI Pipeline',
    description: 'Intent → Emotion → Theme → Insight. Watch your thoughts transform into clarity.',
    brainState: 'analyzing',
    color: '#8B5CF6',
  },
  {
    id: 'features',
    title: '21 Ways to',
    subtitle: 'See Yourself',
    description: 'From emotional timelines to contradiction tracking. Every angle of your mind, visualized.',
    brainState: 'processing',
    color: '#EC4899',
  },
  {
    id: 'science',
    title: 'Built on',
    subtitle: 'CBT Science',
    description: 'Clinical frameworks meet modern AI. Spot patterns a therapist would notice.',
    brainState: 'insight',
    color: '#10B981',
  },
  {
    id: 'cta',
    title: 'See Your Mind.',
    subtitle: 'Clearly.',
    description: 'Join the waitlist for early access.',
    brainState: 'glow',
    color: '#F59E0B',
  },
]

export function ScrollScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [brainState, setBrainState] = useState<Section['brainState']>('idle')
  const [brainColor, setBrainColor] = useState('#6366F1')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth spring for animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Update active section based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const sectionIndex = Math.min(
        Math.floor(latest * sections.length),
        sections.length - 1
      )
      if (sectionIndex !== activeSection) {
        setActiveSection(sectionIndex)
        setBrainState(sections[sectionIndex].brainState)
        setBrainColor(sections[sectionIndex].color)
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress, activeSection])

  // Calculate opacity for each section
  const getSectionOpacity = (index: number) => {
    const progress = scrollYProgress.get()
    const sectionStart = index / sections.length
    const sectionEnd = (index + 1) / sections.length
    const sectionMid = (sectionStart + sectionEnd) / 2

    if (progress < sectionStart || progress > sectionEnd) return 0
    if (progress < sectionMid) {
      return (progress - sectionStart) / (sectionMid - sectionStart)
    }
    return 1 - (progress - sectionMid) / (sectionEnd - sectionMid)
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${sections.length * 100}vh` }}>
      {/* Fixed container for 3D brain and content */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Background gradient that changes with section */}
        <motion.div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, ${brainColor}15 0%, transparent 70%)`,
          }}
        />

        {/* 3D Brain - centered and fixed */}
        <div className="absolute inset-0 z-0">
          <ImmersiveBrain
            state={brainState}
            color={brainColor}
            progress={smoothProgress}
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pointer-events-none">
          {sections.map((section, index) => (
            <SectionContent
              key={section.id}
              section={section}
              index={index}
              scrollProgress={scrollYProgress}
              totalSections={sections.length}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 1 }}
          animate={{ opacity: activeSection === sections.length - 1 ? 0 : 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Section indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeSection ? 'bg-white scale-150' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface SectionContentProps {
  section: Section
  index: number
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress']
  totalSections: number
}

function SectionContent({ section, index, scrollProgress, totalSections }: SectionContentProps) {
  const sectionStart = index / totalSections
  const sectionEnd = (index + 1) / totalSections
  const isFirst = index === 0
  const isLast = index === totalSections - 1

  // Opacity: fade in, hold, fade out
  // First section starts visible, last section stays visible at end
  const opacity = useTransform(
    scrollProgress,
    isFirst
      ? [0, 0.1, sectionEnd - 0.02, sectionEnd]
      : isLast
        ? [sectionStart, sectionStart + 0.03, 1]
        : [sectionStart, sectionStart + 0.03, sectionEnd - 0.03, sectionEnd],
    isFirst
      ? [1, 1, 1, 0]
      : isLast
        ? [0, 1, 1]
        : [0, 1, 1, 0]
  )

  // Y position: slide up slightly as section progresses
  const y = useTransform(
    scrollProgress,
    [sectionStart, sectionEnd],
    [20, -20]
  )

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity, y }}
    >
      <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2">
        {section.title}
      </motion.h1>
      <motion.h2
        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        style={{ color: section.color }}
      >
        {section.subtitle}
      </motion.h2>
      <motion.p className="text-xl md:text-2xl text-white/70 max-w-2xl">
        {section.description}
      </motion.p>

      {/* CTA button only on last section */}
      {section.id === 'cta' && (
        <motion.div
          className="mt-8 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WaitlistForm />
        </motion.div>
      )}
    </motion.div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 1500))
    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
        <span>✓ You're on the list!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email..."
        required
        className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-72"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </button>
    </form>
  )
}
