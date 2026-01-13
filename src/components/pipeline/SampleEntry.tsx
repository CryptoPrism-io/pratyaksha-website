'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const sampleText = `I felt really anxious about the meeting today. Part of me wants to push through, but another part just wants to avoid it entirely. I know I should face my fears, but the thought of speaking up makes my heart race.`

interface Highlight {
  text: string
  type: 'emotion' | 'action' | 'conflict'
  agent: 'intent' | 'emotion' | 'theme'
}

const highlights: Highlight[] = [
  { text: 'anxious', type: 'emotion', agent: 'intent' },
  { text: 'push through', type: 'action', agent: 'theme' },
  { text: 'avoid', type: 'conflict', agent: 'theme' },
  { text: 'face my fears', type: 'action', agent: 'emotion' },
  { text: 'heart race', type: 'emotion', agent: 'emotion' },
]

const highlightColors = {
  emotion: { bg: 'bg-rose-500/30', text: 'text-rose-300', border: 'border-rose-500/50' },
  action: { bg: 'bg-emerald-500/30', text: 'text-emerald-300', border: 'border-emerald-500/50' },
  conflict: { bg: 'bg-amber-500/30', text: 'text-amber-300', border: 'border-amber-500/50' },
}

interface SampleEntryProps {
  activeAgent: 'none' | 'intent' | 'emotion' | 'theme' | 'insight'
  progress: number
}

export function SampleEntry({ activeAgent, progress }: SampleEntryProps) {
  const renderedText = useMemo(() => {
    let result: React.ReactNode[] = []
    let lastIndex = 0

    // Sort highlights by their position in the text
    const sortedHighlights = [...highlights].sort((a, b) =>
      sampleText.indexOf(a.text) - sampleText.indexOf(b.text)
    )

    sortedHighlights.forEach((highlight, idx) => {
      const startIdx = sampleText.indexOf(highlight.text, lastIndex)
      if (startIdx === -1) return

      // Add text before highlight
      if (startIdx > lastIndex) {
        result.push(
          <span key={`text-${idx}`} className="text-muted-foreground">
            {sampleText.slice(lastIndex, startIdx)}
          </span>
        )
      }

      // Determine if this highlight should be active
      const shouldHighlight =
        activeAgent === highlight.agent ||
        (activeAgent === 'theme' && highlight.agent === 'intent') ||
        (activeAgent === 'emotion' && highlight.agent === 'intent') ||
        (activeAgent === 'insight')

      const colors = highlightColors[highlight.type]

      // Add highlighted word
      result.push(
        <motion.span
          key={`highlight-${idx}`}
          className={cn(
            'relative inline-block px-1 py-0.5 rounded transition-all duration-500',
            shouldHighlight ? `${colors.bg} ${colors.text}` : 'text-muted-foreground'
          )}
          initial={{ backgroundColor: 'transparent' }}
          animate={{
            scale: shouldHighlight ? 1.02 : 1,
          }}
        >
          {highlight.text}
          {shouldHighlight && (
            <motion.span
              className={cn('absolute -bottom-0.5 left-0 right-0 h-0.5 rounded', colors.bg)}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.span>
      )

      lastIndex = startIdx + highlight.text.length
    })

    // Add remaining text
    if (lastIndex < sampleText.length) {
      result.push(
        <span key="text-end" className="text-muted-foreground">
          {sampleText.slice(lastIndex)}
        </span>
      )
    }

    return result
  }, [activeAgent])

  return (
    <div className="relative">
      {/* Quote marks */}
      <span className="absolute -left-4 -top-4 text-6xl text-primary/20 font-serif">"</span>

      <blockquote className="text-xl md:text-2xl leading-relaxed font-light pl-4 border-l-2 border-primary/30">
        {renderedText}
      </blockquote>

      <span className="absolute -right-4 -bottom-8 text-6xl text-primary/20 font-serif">"</span>
    </div>
  )
}
