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
      className={`relative rounded-3xl overflow-hidden ${
        isRecommended
          ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30'
          : ''
      }`}
      style={{
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: isRecommended
          ? '1px solid rgba(99, 102, 241, 0.5)'
          : '0.5px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isRecommended
          ? '0 0 20px rgba(99, 102, 241, 0.2), 0 0 40px rgba(99, 102, 241, 0.1), 0 16px 64px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        background: isRecommended
          ? undefined
          : 'rgba(0, 0, 0, 0.12)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.4 }}
    >
      {/* Recommended badge */}
      {badge && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-4 py-1.5 rounded-bl-2xl">
          {badge}
        </div>
      )}

      <div className="p-8">
        {/* Plan name */}
        <div className="flex items-center gap-2 mb-2">
          {isRecommended ? (
            <Star className="w-5 h-5 text-primary" />
          ) : (
            <Zap className="w-5 h-5 text-white-60" />
          )}
          <h3 className="text-xl font-semibold text-white-95 font-display">{name}</h3>
        </div>

        {/* Price - Enhanced typography */}
        <div className="mb-6">
          <span className="text-5xl font-bold text-white-95 font-data text-shadow-data">${price}</span>
          <span className="text-white-55">/month</span>
        </div>

        {/* Features list */}
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isRecommended ? 'text-primary' : 'text-emerald-400'
              }`} />
              <span className="text-white-70">{feature}</span>
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
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/6 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4">
        {/* Header - Enhanced typography */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display tracking-tight">
            <span className="text-white-95">Simple, </span>
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-white-60 font-light">
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
