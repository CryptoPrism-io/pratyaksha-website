'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  EmotionalTimelinePreview,
  EnergyRadarPreview,
  ThemeCloudPreview,
  HeatmapPreview,
  SankeyFlowPreview,
  ModePiePreview,
  SentimentPulsePreview,
  ContradictionTrackerPreview,
} from './ChartPreviews'

type ChartType =
  | 'emotional-timeline'
  | 'energy-radar'
  | 'theme-cloud'
  | 'heatmap'
  | 'sankey-flow'
  | 'mode-pie'
  | 'sentiment-pulse'
  | 'contradiction-tracker'

interface BentoCardProps {
  title: string
  description: string
  size: '1x1' | '2x1' | '2x2'
  chartType: ChartType
  gradient: string
  index: number
}

const chartComponents: Record<ChartType, React.ComponentType<{ isHovered: boolean }>> = {
  'emotional-timeline': EmotionalTimelinePreview,
  'energy-radar': EnergyRadarPreview,
  'theme-cloud': ThemeCloudPreview,
  'heatmap': HeatmapPreview,
  'sankey-flow': SankeyFlowPreview,
  'mode-pie': ModePiePreview,
  'sentiment-pulse': SentimentPulsePreview,
  'contradiction-tracker': ContradictionTrackerPreview,
}

export function BentoCard({
  title,
  description,
  size,
  chartType,
  gradient,
  index,
}: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const ChartComponent = chartComponents[chartType]

  const sizeClasses = {
    '1x1': '',
    '2x1': 'md:col-span-2',
    '2x2': 'md:col-span-2 md:row-span-2',
  }

  const heightClasses = {
    '1x1': 'h-48 md:h-56',
    '2x1': 'h-48 md:h-56',
    '2x2': 'h-48 md:h-[472px]',
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-pointer group',
        'border border-white/10',
        sizeClasses[size],
        heightClasses[size]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {/* Background gradient */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} />

      {/* Animated glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
        }}
      />

      {/* Chart preview */}
      <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
        <div className={cn(
          'w-full transition-all duration-500',
          size === '2x2' ? 'h-3/4' : 'h-full'
        )}>
          <ChartComponent isHovered={isHovered} />
        </div>
      </div>

      {/* Gradient overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

      {/* Text content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
        <motion.h3
          className="text-lg font-semibold text-white mb-1"
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-sm text-gray-300"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
      </div>

      {/* Hover border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-primary/50 opacity-0 pointer-events-none z-40"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Corner accent */}
      <div className="absolute top-3 right-3 w-8 h-8 z-30">
        <motion.div
          className="w-full h-full rounded-full bg-white/10 flex items-center justify-center"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
        >
          <svg
            className="w-4 h-4 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}
