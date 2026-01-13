'use client'

import { motion } from 'framer-motion'

const nodes = [
  { x: 100, label: 'Journal', sub: 'Your Entry', color: '#6366F1' },
  { x: 300, label: 'Intent', sub: 'Classification', color: '#8B5CF6' },
  { x: 500, label: 'Emotion', sub: 'Analysis', color: '#EC4899' },
  { x: 700, label: 'Theme', sub: 'Patterns', color: '#F59E0B' },
  { x: 900, label: 'Insight', sub: 'Action', color: '#10B981' },
]

export function NeuralPipelineDiagram() {
  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox="0 0 1000 200"
        className="w-full h-auto"
        aria-label="AI Pipeline: Journal to Intent to Emotion to Theme to Insight"
      >
        <defs>
          <linearGradient id="pipelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="25%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connecting line background */}
        <motion.path
          d="M 100 100 L 900 100"
          stroke="rgba(99, 102, 241, 0.2)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Animated connecting line */}
        <motion.path
          d="M 100 100 L 900 100"
          stroke="url(#pipelineGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* Data flow particles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="100"
            cy="100"
            r="4"
            fill="#fff"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{
              cx: [100, 300, 500, 700, 900],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.label}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            {/* Outer glow ring */}
            <circle
              cx={node.x}
              cy={100}
              r={38}
              fill="none"
              stroke={node.color}
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Main circle */}
            <circle
              cx={node.x}
              cy={100}
              r={30}
              fill="#0A0A0F"
              stroke={node.color}
              strokeWidth="2"
            />

            {/* Inner gradient */}
            <circle
              cx={node.x}
              cy={100}
              r={28}
              fill={`${node.color}20`}
            />

            {/* Label */}
            <text
              x={node.x}
              y={105}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="600"
            >
              {node.label}
            </text>

            {/* Sub-label */}
            <text
              x={node.x}
              y={155}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="10"
            >
              {node.sub}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Mobile-friendly labels below */}
      <div className="flex justify-between mt-4 md:hidden px-2">
        {nodes.map((node) => (
          <div key={node.label} className="text-center flex-1">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: node.color }}
            />
            <p className="text-xs text-white font-medium">{node.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
