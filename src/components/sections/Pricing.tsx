'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PricingCardProps {
  name: string
  price: number
  features: string[]
  cta: string
  variant: 'default' | 'recommended'
  badge?: string
}

function PricingCard({ name, price, features, cta, variant, badge }: PricingCardProps) {
  const isRecommended = variant === 'recommended'

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${
        isRecommended
          ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-2 border-primary'
          : 'glass-card border border-white/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      {/* Recommended badge */}
      {badge && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
          {badge}
        </div>
      )}

      <div className="p-8">
        {/* Plan name */}
        <div className="flex items-center gap-2 mb-2">
          {isRecommended ? (
            <Star className="w-5 h-5 text-primary" />
          ) : (
            <Zap className="w-5 h-5 text-muted-foreground" />
          )}
          <h3 className="text-xl font-semibold text-white">{name}</h3>
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="text-4xl font-bold text-white">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>

        {/* Features list */}
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isRecommended ? 'text-primary' : 'text-emerald-400'
              }`} />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <Button
          className="w-full"
          variant={isRecommended ? 'glow' : 'glass'}
          size="lg"
        >
          {cta}
        </Button>
      </div>
    </motion.div>
  )
}

export function Pricing() {
  return (
    <section className="py-16 md:py-24 bg-slate-950/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-slate-950/50 to-black/50" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Free Tier */}
          <PricingCard
            name="Free"
            price={0}
            features={[
              '50 entries per month',
              'Basic visualizations',
              '7-day data retention',
              'Community support',
            ]}
            cta="Start Free"
            variant="default"
          />

          {/* Pro Tier */}
          <PricingCard
            name="Pro"
            price={9}
            features={[
              'Unlimited entries',
              'All 21 visualizations',
              'Export & share reports',
              'Priority AI processing',
              'Weekly email digests',
              'API access',
            ]}
            cta="Get Pro"
            variant="recommended"
            badge="Recommended"
          />
        </div>

        {/* Additional note */}
        <motion.p
          className="text-center text-muted-foreground mt-8 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          All plans include full privacy protection. Cancel anytime.
        </motion.p>
      </div>
    </section>
  )
}
