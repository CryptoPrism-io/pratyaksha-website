/**
 * Frame Preloader for Scroll Animation
 *
 * Intelligent image preloading with:
 * - Priority queue based on scroll direction
 * - Memory budget management
 * - Caching for loaded frames
 */

export interface FramePreloaderOptions {
  basePath: string
  sections: string[]
  framesPerSection: number
  isMobile?: boolean
  maxCachedFrames?: number
  onProgress?: (loaded: number, total: number) => void
}

export interface PreloadedFrame {
  src: string
  img: HTMLImageElement
  loaded: boolean
}

export class FramePreloader {
  private cache: Map<string, HTMLImageElement> = new Map()
  private loading: Set<string> = new Set()
  private options: Required<FramePreloaderOptions>
  private totalFrames: number

  constructor(options: FramePreloaderOptions) {
    this.options = {
      isMobile: false,
      maxCachedFrames: 100,
      onProgress: () => {},
      ...options,
    }
    this.totalFrames = this.options.sections.length * this.options.framesPerSection
  }

  /**
   * Get frame path for a given section and frame index
   */
  getFramePath(sectionIndex: number, frameIndex: number): string {
    const section = this.options.sections[sectionIndex]
    const frameNum = String(frameIndex + 1).padStart(3, '0')
    const mobilePath = this.options.isMobile ? 'mobile/' : ''
    // Desktop uses original JPGs for quality, mobile uses compressed WebP
    const ext = this.options.isMobile ? 'webp' : 'jpg'
    return `${this.options.basePath}/${section}/${mobilePath}frame-${frameNum}.${ext}`
  }

  /**
   * Get global frame index from section and local frame index
   */
  getGlobalFrameIndex(sectionIndex: number, frameIndex: number): number {
    return sectionIndex * this.options.framesPerSection + frameIndex
  }

  /**
   * Get section and local frame index from global index
   */
  getSectionAndFrame(globalIndex: number): { section: number; frame: number } {
    const section = Math.floor(globalIndex / this.options.framesPerSection)
    const frame = globalIndex % this.options.framesPerSection
    return { section, frame }
  }

  /**
   * Preload a single frame
   */
  async preloadFrame(sectionIndex: number, frameIndex: number): Promise<HTMLImageElement> {
    const path = this.getFramePath(sectionIndex, frameIndex)

    // Return cached image if available
    if (this.cache.has(path)) {
      return this.cache.get(path)!
    }

    // Wait if already loading
    if (this.loading.has(path)) {
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.cache.has(path)) {
            clearInterval(checkLoaded)
            resolve(this.cache.get(path)!)
          }
        }, 10)
      })
    }

    // Load new image
    this.loading.add(path)

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.cache.set(path, img)
        this.loading.delete(path)
        this.enforceMemoryLimit()
        this.options.onProgress(this.cache.size, this.totalFrames)
        resolve(img)
      }
      img.onerror = () => {
        this.loading.delete(path)
        reject(new Error(`Failed to load frame: ${path}`))
      }
      img.src = path
    })
  }

  /**
   * Get a frame (returns cached or loads)
   */
  getFrame(sectionIndex: number, frameIndex: number): HTMLImageElement | null {
    const path = this.getFramePath(sectionIndex, frameIndex)
    return this.cache.get(path) || null
  }

  /**
   * Preload frames around current position
   */
  async preloadAround(
    currentSection: number,
    currentFrame: number,
    ahead: number = 24,
    behind: number = 12
  ): Promise<void> {
    const promises: Promise<HTMLImageElement>[] = []
    const globalIndex = this.getGlobalFrameIndex(currentSection, currentFrame)

    // Preload ahead (priority)
    for (let i = 0; i <= ahead; i++) {
      const idx = globalIndex + i
      if (idx < this.totalFrames) {
        const { section, frame } = this.getSectionAndFrame(idx)
        promises.push(this.preloadFrame(section, frame))
      }
    }

    // Preload behind (lower priority)
    for (let i = 1; i <= behind; i++) {
      const idx = globalIndex - i
      if (idx >= 0) {
        const { section, frame } = this.getSectionAndFrame(idx)
        promises.push(this.preloadFrame(section, frame))
      }
    }

    await Promise.allSettled(promises)
  }

  /**
   * Preload initial frames for quick start
   */
  async preloadInitial(count: number = 48): Promise<void> {
    const promises: Promise<HTMLImageElement>[] = []

    for (let i = 0; i < Math.min(count, this.totalFrames); i++) {
      const { section, frame } = this.getSectionAndFrame(i)
      promises.push(this.preloadFrame(section, frame))
    }

    await Promise.allSettled(promises)
  }

  /**
   * Preload entire section
   */
  async preloadSection(sectionIndex: number): Promise<void> {
    const promises: Promise<HTMLImageElement>[] = []

    for (let i = 0; i < this.options.framesPerSection; i++) {
      promises.push(this.preloadFrame(sectionIndex, i))
    }

    await Promise.allSettled(promises)
  }

  /**
   * Enforce memory limit by removing oldest frames
   */
  private enforceMemoryLimit(): void {
    if (this.cache.size <= this.options.maxCachedFrames) return

    const toRemove = this.cache.size - this.options.maxCachedFrames
    const keys = Array.from(this.cache.keys())

    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(keys[i])
    }
  }

  /**
   * Clear all cached frames
   */
  clear(): void {
    this.cache.clear()
    this.loading.clear()
  }

  /**
   * Get cache statistics
   */
  getStats(): { cached: number; loading: number; total: number } {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
      total: this.totalFrames,
    }
  }
}

// Singleton instance for the main scroll animation
let mainPreloader: FramePreloader | null = null

export function getMainPreloader(isMobile: boolean = false): FramePreloader {
  if (!mainPreloader) {
    mainPreloader = new FramePreloader({
      basePath: '/animations/scroll',
      sections: ['1-logo', '2-logo-brain', '3-brain-agent', '4-agent-viz'],
      framesPerSection: isMobile ? 48 : 96,
      isMobile,
      maxCachedFrames: isMobile ? 60 : 120,
    })
  }
  return mainPreloader
}
