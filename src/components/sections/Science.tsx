'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Brain, AlertTriangle } from 'lucide-react'
import { NeuralPipelineDiagram } from '@/components/diagrams/NeuralPipelineDiagram'

interface TrustBadgeProps {
  icon: React.ReactNode
  title: string
  description: string
}

function TrustBadge({ icon, title, description }: TrustBadgeProps) {
  return (
    <motion.div
      className="glass-card p-6 rounded-xl text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}

export function Science() {
  return (
    <section className="py-24 bg-slate-950/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950/50 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Brain className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Science-Backed</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built on Cognitive Behavioral Therapy Principles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our 4-agent AI pipeline is inspired by clinical CBT assessment
            frameworks, helping you identify patterns a therapist would spot.
          </p>
        </motion.div>

        {/* Neural Pipeline Diagram */}
        <motion.div
          className="mb-16 glass-card p-6 md:p-8 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <NeuralPipelineDiagram />
        </motion.div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <TrustBadge
            icon={<Shield className="w-6 h-6" />}
            title="Privacy-First"
            description="Your data lives in YOUR Airtable. We never see or store your journal entries."
          />
          <TrustBadge
            icon={<Brain className="w-6 h-6" />}
            title="CBT-Inspired"
            description="Analysis framework based on established clinical assessment methods."
          />
          <TrustBadge
            icon={<Lock className="w-6 h-6" />}
            title="Secure Connection"
            description="End-to-end TLS encryption for all data transfers."
          />
        </div>

        {/* Disclaimer */}
        <motion.div
          className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-5 flex items-start gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 text-sm">
              <strong>Important:</strong> Pratyaksha is a self-reflection tool,
              not a replacement for professional therapy. If you&apos;re experiencing
              mental health challenges, please consult a qualified professional.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
