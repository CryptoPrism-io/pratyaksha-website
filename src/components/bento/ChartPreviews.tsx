'use client'

import { motion } from 'framer-motion'

// Animated Emotional Timeline Preview
export function EmotionalTimelinePreview({ isHovered }: { isHovered: boolean }) {
  const points = [20, 45, 30, 60, 40, 75, 55, 70, 50, 65]
  const path = `M 0 ${100 - points[0]} ${points.map((p, i) => `L ${i * 40} ${100 - p}`).join(' ')}`

  return (
    <svg viewBox="0 0 360 100" className="w-full h-full">
      <defs>
        <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="timelineFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke="url(#timelineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.6 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      <motion.path
        d={`${path} L 360 100 L 0 100 Z`}
        fill="url(#timelineFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0.5 }}
        transition={{ duration: 0.5 }}
      />
      {isHovered && points.map((p, i) => (
        <motion.circle
          key={i}
          cx={i * 40}
          cy={100 - p}
          r="4"
          fill="#6366F1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}
    </svg>
  )
}

// Animated Energy Radar Preview
export function EnergyRadarPreview({ isHovered }: { isHovered: boolean }) {
  const dimensions = 5
  const values = [0.8, 0.6, 0.9, 0.5, 0.7]
  const centerX = 50
  const centerY = 50
  const radius = 35

  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / dimensions - Math.PI / 2
    return {
      x: centerX + Math.cos(angle) * radius * value,
      y: centerY + Math.sin(angle) * radius * value,
    }
  }

  const points = values.map((v, i) => getPoint(i, v))
  const path = `M ${points[0].x} ${points[0].y} ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')} Z`

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Grid rings */}
      {[0.33, 0.66, 1].map((scale, i) => (
        <circle
          key={i}
          cx={centerX}
          cy={centerY}
          r={radius * scale}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      {/* Radar shape */}
      <motion.path
        d={path}
        fill="url(#radarGradient)"
        stroke="#3B82F6"
        strokeWidth="2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: isHovered ? 1 : 0.8, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: 'center' }}
      />
      {/* Points */}
      {isHovered && points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#3B82F6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </svg>
  )
}

// Animated Theme Cloud Preview
export function ThemeCloudPreview({ isHovered }: { isHovered: boolean }) {
  const words = [
    { text: 'anxiety', x: 30, y: 30, size: 14 },
    { text: 'growth', x: 70, y: 25, size: 18 },
    { text: 'work', x: 50, y: 50, size: 16 },
    { text: 'family', x: 25, y: 60, size: 12 },
    { text: 'goals', x: 75, y: 65, size: 14 },
    { text: 'health', x: 50, y: 75, size: 13 },
  ]

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {words.map((word, i) => (
        <motion.text
          key={word.text}
          x={word.x}
          y={word.y}
          fontSize={word.size}
          fill="#8B5CF6"
          textAnchor="middle"
          className="font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0.6,
            y: isHovered ? Math.sin(i * 0.5) * 3 : 0,
          }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          {word.text}
        </motion.text>
      ))}
    </svg>
  )
}

// Animated Heatmap Preview
export function HeatmapPreview({ isHovered }: { isHovered: boolean }) {
  const weeks = 7
  const days = 7
  const cells = Array.from({ length: weeks * days }, (_, i) => ({
    x: (i % weeks) * 13 + 5,
    y: Math.floor(i / weeks) * 13 + 5,
    intensity: Math.random(),
  }))

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {cells.map((cell, i) => (
        <motion.rect
          key={i}
          x={cell.x}
          y={cell.y}
          width="11"
          height="11"
          rx="2"
          fill={`rgba(16, 185, 129, ${cell.intensity})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          transition={{ delay: i * 0.01, duration: 0.3 }}
        />
      ))}
    </svg>
  )
}

// Animated Sankey Flow Preview
export function SankeyFlowPreview({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <defs>
        <linearGradient id="sankeyGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="sankeyGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 20 30 Q 100 20 180 50"
        fill="none"
        stroke="url(#sankeyGradient1)"
        strokeWidth="20"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.7 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d="M 20 70 Q 100 80 180 50"
        fill="none"
        stroke="url(#sankeyGradient2)"
        strokeWidth="15"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.7 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </svg>
  )
}

// Animated Mode Pie Preview
export function ModePiePreview({ isHovered }: { isHovered: boolean }) {
  const segments = [
    { percent: 35, color: '#6366F1' },
    { percent: 25, color: '#8B5CF6' },
    { percent: 20, color: '#EC4899' },
    { percent: 20, color: '#F59E0B' },
  ]

  let cumulativePercent = 0

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.g
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      >
        {segments.map((segment, i) => {
          const startPercent = cumulativePercent
          cumulativePercent += segment.percent
          const startAngle = (startPercent / 100) * 360 - 90
          const endAngle = (cumulativePercent / 100) * 360 - 90
          const largeArcFlag = segment.percent > 50 ? 1 : 0
          const startX = 50 + 35 * Math.cos((startAngle * Math.PI) / 180)
          const startY = 50 + 35 * Math.sin((startAngle * Math.PI) / 180)
          const endX = 50 + 35 * Math.cos((endAngle * Math.PI) / 180)
          const endY = 50 + 35 * Math.sin((endAngle * Math.PI) / 180)

          return (
            <motion.path
              key={i}
              d={`M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
              fill={segment.color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.7, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ transformOrigin: '50px 50px' }}
            />
          )
        })}
      </motion.g>
      <circle cx="50" cy="50" r="15" fill="#0A0A0F" />
    </svg>
  )
}

// Animated Sentiment Pulse Preview
export function SentimentPulsePreview({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="#EC4899"
        strokeWidth="2"
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={{
          scale: isHovered ? [1, 1.3, 1] : 1,
          opacity: isHovered ? [0.8, 0.3, 0.8] : 0.5,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: 'center' }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="#EC4899"
        strokeWidth="2"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? [1, 0.5, 1] : 0.6,
        }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        style={{ transformOrigin: 'center' }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="10"
        fill="#EC4899"
        animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </svg>
  )
}

// Animated Contradiction Tracker Preview
export function ContradictionTrackerPreview({ isHovered }: { isHovered: boolean }) {
  const bars = [
    { label: 'Action', value: 70, color: '#10B981' },
    { label: 'Fear', value: 55, color: '#EF4444' },
    { label: 'Growth', value: 85, color: '#3B82F6' },
    { label: 'Comfort', value: 40, color: '#F59E0B' },
  ]

  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {bars.map((bar, i) => (
        <g key={bar.label}>
          <motion.rect
            x={i * 50 + 10}
            y={100 - bar.value}
            width="30"
            height={bar.value}
            fill={bar.color}
            rx="4"
            initial={{ height: 0, y: 100 }}
            animate={{
              height: isHovered ? bar.value : bar.value * 0.6,
              y: isHovered ? 100 - bar.value : 100 - bar.value * 0.6,
            }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        </g>
      ))}
    </svg>
  )
}
