import { Hero } from '@/components/sections/Hero'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Placeholder sections */}
      <section className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">4-Agent Pipeline Section</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">21 Powerful Visualizations</h2>
          <p className="text-muted-foreground">Bento Grid Section</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Built on Science</h2>
          <p className="text-muted-foreground">Trust & Credibility Section</p>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">See Your Mind. Clearly.</h2>
          <p className="text-indigo-200 mb-8">Join the waitlist for early access</p>
        </div>
      </section>
    </main>
  )
}
