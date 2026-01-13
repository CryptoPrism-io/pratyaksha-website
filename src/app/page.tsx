'use client'

import dynamic from 'next/dynamic'

// Dynamic import for scroll scene to avoid SSR issues with Three.js
const ScrollScene = dynamic(
  () => import('@/components/scroll/ScrollScene').then((mod) => mod.ScrollScene),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <ScrollScene />
    </main>
  )
}
