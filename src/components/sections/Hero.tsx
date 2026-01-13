'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  const [inputText, setInputText] = useState('')

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-background to-purple-950/30" />

      {/* Animated background particles placeholder */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 3D Brain placeholder */}
        <motion.div
          className="mb-8 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center glass-card">
            <Sparkles className="w-24 h-24 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            3D Brain will render here
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="gradient-text">Your Mind,</span>
          <br />
          <span className="text-foreground">Visualized.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          AI-powered cognitive journaling that reveals emotional patterns,
          energy states, and actionable insights you&apos;ve never seen before.
        </motion.p>

        {/* Interactive input */}
        <motion.div
          className="mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="glass-card p-1">
            <Input
              type="text"
              placeholder="Write how you're feeling..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="bg-transparent border-0 text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Type an emotion to see the brain react
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button size="lg" className="glow-hover">
            See Your Mind
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="glass-card border-0">
            Watch Demo
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
