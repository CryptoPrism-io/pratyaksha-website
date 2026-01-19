'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { FramePreloader } from '@/lib/framePreloader'

interface ScrollSequenceProps {
  /** Height of the scroll container (e.g., '400vh') */
  height?: string
  /** Show loading indicator */
  showLoader?: boolean
  /** Callback when section changes */
  onSectionChange?: (section: number) => void
  /** Callback with current progress */
  onProgress?: (progress: number, section: number, frame: number) => void
  /** Children to overlay on the animation */
  children?: React.ReactNode
  /** Additional class names */
  className?: string
  /** Animation duration per section in ms */
  animationDuration?: number
  /** FPS for animation playback */
  fps?: number
}

const SECTIONS = ['1-logo', '2-logo-brain', '3-brain-agent', '4-agent-viz']
const SECTION_NAMES = ['Logo Reveal', 'Logo to Brain', 'Brain to Agent', 'Agent to Viz']

export function ScrollSequence({
  height = '400vh',
  showLoader = true,
  onSectionChange,
  onProgress,
  children,
  className = '',
  animationDuration = 3000, // 3 seconds per section
  fps = 30,
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const preloaderRef = useRef<FramePreloader | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastRenderedFrameRef = useRef<number>(-1)

  const [isReady, setIsReady] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())
  const [currentFrame, setCurrentFrame] = useState(0)

  // Track which section we've triggered
  const triggeredSectionRef = useRef<number>(-1)
  const framesPerSectionRef = useRef<number>(96)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      framesPerSectionRef.current = mobile ? 48 : 96
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize preloader
  useEffect(() => {
    const framesPerSection = isMobile ? 48 : 96
    framesPerSectionRef.current = framesPerSection

    preloaderRef.current = new FramePreloader({
      basePath: '/animations/scroll',
      sections: SECTIONS,
      framesPerSection,
      isMobile,
      maxCachedFrames: isMobile ? 200 : 400,
      onProgress: (loaded, total) => {
        setLoadingProgress(loaded / total)
      },
    })

    const preloader = preloaderRef.current

    // Preload all sections
    preloader.preloadSection(0).then(() => {
      setIsReady(true)
      return preloader.preloadSection(1)
    }).then(() => {
      return preloader.preloadSection(2)
    }).then(() => {
      return preloader.preloadSection(3)
    }).catch((err) => {
      console.warn('[ScrollSequence] Preload error:', err)
    })

    return () => {
      preloaderRef.current?.clear()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMobile])

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // Render frame to canvas
  const renderFrame = useCallback((globalFrameIndex: number) => {
    const canvas = canvasRef.current
    const preloader = preloaderRef.current
    if (!canvas || !preloader) return false

    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    const { section, frame } = preloader.getSectionAndFrame(globalFrameIndex)
    const img = preloader.getFrame(section, frame)

    if (!img) {
      // Try to load the frame
      preloader.preloadFrame(section, frame)
      return false
    }

    const rect = canvas.getBoundingClientRect()
    const canvasWidth = rect.width
    const canvasHeight = rect.height

    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Calculate cover fit
    const imgRatio = img.width / img.height
    const canvasRatio = canvasWidth / canvasHeight

    let drawWidth, drawHeight, drawX, drawY

    if (imgRatio > canvasRatio) {
      drawHeight = canvasHeight
      drawWidth = drawHeight * imgRatio
      drawX = (canvasWidth - drawWidth) / 2
      drawY = 0
    } else {
      drawWidth = canvasWidth
      drawHeight = drawWidth / imgRatio
      drawX = 0
      drawY = (canvasHeight - drawHeight) / 2
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    lastRenderedFrameRef.current = globalFrameIndex
    return true
  }, [])

  // Play animation for a section
  const playSection = useCallback((sectionIndex: number) => {
    if (isPlaying || sectionIndex < 0 || sectionIndex >= SECTIONS.length) return
    if (completedSections.has(sectionIndex) && sectionIndex < SECTIONS.length - 1) return

    setIsPlaying(true)
    setCurrentSection(sectionIndex)
    onSectionChange?.(sectionIndex)

    const framesPerSection = framesPerSectionRef.current
    const startFrame = sectionIndex * framesPerSection
    const endFrame = startFrame + framesPerSection - 1
    const frameInterval = animationDuration / framesPerSection

    let currentFrameIndex = startFrame
    let lastTime = performance.now()

    const animate = (time: number) => {
      const deltaTime = time - lastTime

      if (deltaTime >= frameInterval) {
        lastTime = time - (deltaTime % frameInterval)

        renderFrame(currentFrameIndex)
        setCurrentFrame(currentFrameIndex - startFrame)

        const progress = (sectionIndex + (currentFrameIndex - startFrame) / framesPerSection) / SECTIONS.length
        onProgress?.(progress, sectionIndex, currentFrameIndex - startFrame)

        currentFrameIndex++

        if (currentFrameIndex > endFrame) {
          // Animation complete
          setIsPlaying(false)
          setCompletedSections(prev => new Set([...prev, sectionIndex]))
          triggeredSectionRef.current = sectionIndex
          return
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [isPlaying, completedSections, animationDuration, renderFrame, onSectionChange, onProgress])

  // Handle scroll - trigger animations based on scroll position
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!isReady) return

    // Calculate which section should be active based on scroll
    const targetSection = Math.min(
      Math.floor(progress * SECTIONS.length),
      SECTIONS.length - 1
    )

    // Only trigger if we've scrolled to a new section and not currently playing
    if (targetSection > triggeredSectionRef.current && !isPlaying) {
      // Trigger next section in sequence
      const nextSection = triggeredSectionRef.current + 1
      if (nextSection <= targetSection && nextSection < SECTIONS.length) {
        playSection(nextSection)
      }
    }
  })

  // Render first frame and auto-play first section when ready
  useEffect(() => {
    if (isReady && triggeredSectionRef.current === -1) {
      renderFrame(0)
      // Small delay then auto-play first section
      const timer = setTimeout(() => {
        playSection(0)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isReady, renderFrame, playSection])

  // Calculate visual progress for the progress bar
  const visualProgress = currentSection / SECTIONS.length +
    (currentFrame / framesPerSectionRef.current) / SECTIONS.length

  return (
    <section
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height }}
    >
      {/* Sticky canvas container */}
      <div className="sticky top-0 z-10 w-full h-screen overflow-hidden">
        {/* Loading overlay */}
        {showLoader && !isReady && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="mt-4 text-sm text-white/50">
              Loading experience... {Math.round(loadingProgress * 100)}%
            </p>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: '#000' }}
        />

        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute top-8 right-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-white/70">Playing</span>
          </div>
        )}

        {/* Section indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          {/* Section dots */}
          <div className="flex items-center gap-2">
            {SECTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`transition-[width,background-color] duration-500 rounded-full ${
                  idx === currentSection && isPlaying
                    ? 'w-8 h-2 bg-cyan-400'
                    : idx === currentSection
                      ? 'w-8 h-2 bg-white'
                      : completedSections.has(idx)
                        ? 'w-2 h-2 bg-white/60'
                        : 'w-2 h-2 bg-white/20'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-white/50">
            {SECTION_NAMES[currentSection]}
            {!isPlaying && !completedSections.has(currentSection) && currentSection > 0 && (
              <span className="ml-2 text-cyan-400">↓ Scroll to play</span>
            )}
          </p>
        </div>

        {/* Children overlay */}
        {children && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="pointer-events-auto">
              {children}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
