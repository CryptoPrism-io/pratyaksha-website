'use client'

import dynamic from 'next/dynamic'

// Dynamic import for story scene to avoid SSR issues with Three.js
const StoryScene = dynamic(
  () => import('@/components/scroll/StoryScene').then((mod) => mod.StoryScene),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 animate-pulse mx-auto mb-4" />
          <p className="text-white/50">Preparing your journey...</p>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <StoryScene />
    </main>
  )
}
