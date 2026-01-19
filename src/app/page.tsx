import { Hero } from '@/components/sections/Hero'
import { ScrollStory } from '@/components/sections/ScrollStory'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Features } from '@/components/sections/Features'
import { Science } from '@/components/sections/Science'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { FinalCTA } from '@/components/sections/FinalCTA'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      <ScrollStory />

      <HowItWorks />

      <Features />

      <Science />

      <Testimonials />

      <Pricing />

      <FinalCTA />
    </main>
  )
}
