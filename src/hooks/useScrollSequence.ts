'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { FramePreloader, getMainPreloader } from '@/lib/framePreloader'

export interface ScrollSequenceConfig {
  /** Total sections in the sequence */
  totalSections: number
  /** Frames per section */
  framesPerSection: number
  /** Callback when frame changes */
  onFrameChange?: (frame: number, section: number, progress: number) => void
  /** Callback when section changes */
  onSectionChange?: (section: number) => void
}

export interface ScrollSequenceState {
  /** Current global frame index (0 to totalFrames-1) */
  currentFrame: number
  /** Current section index (0 to totalSections-1) */
  currentSection: number
  /** Progress within current section (0 to 1) */
  sectionProgress: number
  /** Overall progress (0 to 1) */
  totalProgress: number
  /** Whether initial frames are loaded */
  isReady: boolean
  /** Loading progress (0 to 1) */
  loadingProgress: number
}

export interface UseScrollSequenceReturn extends ScrollSequenceState {
  /** Ref to attach to the scroll container */
  containerRef: React.RefObject<HTMLDivElement>
  /** Get image element for current frame */
  getCurrentImage: () => HTMLImageElement | null
  /** Get image element for specific frame */
  getImage: (section: number, frame: number) => HTMLImageElement | null
  /** Preloader instance */
  preloader: FramePreloader | null
}

const SECTIONS = ['1-logo', '2-logo-brain', '3-brain-agent', '4-agent-viz']

export function useScrollSequence(config?: Partial<ScrollSequenceConfig>): UseScrollSequenceReturn {
  const {
    totalSections = 4,
    framesPerSection = 96,
    onFrameChange,
    onSectionChange,
  } = config || {}

  const containerRef = useRef<HTMLDivElement>(null)
  const preloaderRef = useRef<FramePreloader | null>(null)
  const lastSectionRef = useRef<number>(-1)
  const rafRef = useRef<number | null>(null)

  const [state, setState] = useState<ScrollSequenceState>({
    currentFrame: 0,
    currentSection: 0,
    sectionProgress: 0,
    totalProgress: 0,
    isReady: false,
    loadingProgress: 0,
  })

  // Initialize preloader
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const actualFramesPerSection = isMobile ? 48 : framesPerSection

    preloaderRef.current = new FramePreloader({
      basePath: '/animations/scroll',
      sections: SECTIONS,
      framesPerSection: actualFramesPerSection,
      isMobile,
      maxCachedFrames: isMobile ? 60 : 120,
      onProgress: (loaded, total) => {
        setState(prev => ({
          ...prev,
          loadingProgress: loaded / total,
        }))
      },
    })

    // Preload initial frames
    preloaderRef.current.preloadInitial(48).then(() => {
      setState(prev => ({ ...prev, isReady: true }))
    })

    return () => {
      preloaderRef.current?.clear()
    }
  }, [framesPerSection])

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !preloaderRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const containerHeight = container.offsetHeight
    const viewportHeight = window.innerHeight

    // Calculate scroll progress (0 to 1)
    // Progress starts when container enters viewport and ends when it exits
    const scrollableDistance = containerHeight - viewportHeight
    const scrolled = -rect.top
    const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance))

    const totalFrames = totalSections * preloaderRef.current.options.framesPerSection
    const currentFrame = Math.min(
      Math.floor(progress * totalFrames),
      totalFrames - 1
    )

    const { section, frame } = preloaderRef.current.getSectionAndFrame(currentFrame)
    const sectionProgress = frame / (preloaderRef.current.options.framesPerSection - 1)

    // Update state
    setState(prev => {
      if (prev.currentFrame === currentFrame) return prev

      return {
        ...prev,
        currentFrame,
        currentSection: section,
        sectionProgress,
        totalProgress: progress,
      }
    })

    // Callbacks
    onFrameChange?.(currentFrame, section, progress)

    if (section !== lastSectionRef.current) {
      lastSectionRef.current = section
      onSectionChange?.(section)
    }

    // Preload around current position
    preloaderRef.current.preloadAround(section, frame, 24, 12)
  }, [totalSections, onFrameChange, onSectionChange])

  // Scroll listener with RAF throttling
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        handleScroll()
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  // Get current image
  const getCurrentImage = useCallback(() => {
    if (!preloaderRef.current) return null
    const { section, frame } = preloaderRef.current.getSectionAndFrame(state.currentFrame)
    return preloaderRef.current.getFrame(section, frame)
  }, [state.currentFrame])

  // Get specific image
  const getImage = useCallback((section: number, frame: number) => {
    if (!preloaderRef.current) return null
    return preloaderRef.current.getFrame(section, frame)
  }, [])

  return {
    ...state,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    getCurrentImage,
    getImage,
    preloader: preloaderRef.current,
  }
}
