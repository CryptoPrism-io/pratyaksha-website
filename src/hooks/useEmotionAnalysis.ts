'use client'

import { useMemo } from 'react'
import { EMOTION_KEYWORDS, DEFAULT_EMOTION, type EmotionConfig } from '@/lib/constants'

export interface EmotionState extends EmotionConfig {
  detectedKeyword: string | null
  intensity: number
}

const DEFAULT_STATE: EmotionState = {
  ...DEFAULT_EMOTION,
  detectedKeyword: null,
  intensity: 0.5,
}

export function useEmotionAnalysis(text: string): EmotionState {
  return useMemo(() => {
    if (!text.trim()) {
      return DEFAULT_STATE
    }

    const words = text.toLowerCase().split(/\s+/)
    let dominantEmotion: EmotionConfig | null = null
    let detectedKeyword: string | null = null
    let maxWeight = 0

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (EMOTION_KEYWORDS[word]) {
        // Weight by recency (later words matter more)
        const weight = (i + 1) / words.length + 1
        if (weight > maxWeight) {
          maxWeight = weight
          dominantEmotion = EMOTION_KEYWORDS[word]
          detectedKeyword = word
        }
      }
    }

    if (dominantEmotion && detectedKeyword) {
      return {
        ...dominantEmotion,
        detectedKeyword,
        intensity: Math.min(maxWeight / 2, 1),
      }
    }

    return DEFAULT_STATE
  }, [text])
}

// Hook to check for reduced motion preference
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Hook to detect device performance capabilities
export function use3DPerformance(): { enable3D: boolean; quality: 'high' | 'low' } {
  if (typeof window === 'undefined') {
    return { enable3D: true, quality: 'high' }
  }

  // Check for WebGL support
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

  if (!gl) {
    return { enable3D: false, quality: 'low' }
  }

  // Check device memory (if available)
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile || (deviceMemory && deviceMemory < 4)) {
    return { enable3D: true, quality: 'low' }
  }

  return { enable3D: true, quality: 'high' }
}
