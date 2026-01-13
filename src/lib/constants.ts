// Brand constants for Pratyaksha Marketing Website

export const BRAND = {
  name: 'Pratyaksha',
  tagline: 'See Your Mind. Clearly.',
  description: 'AI-powered cognitive journal that visualizes your mind',
  url: 'https://pratyaksha.app',
  twitter: '@PratyakshaApp',
  email: 'hello@pratyaksha.app',
}

export const COLORS = {
  primary: '#6366F1', // Soft Indigo
  secondary: '#8B5CF6', // Soft Purple
  accent: '#10B981', // Calm Green
  background: '#0A0A0F', // Near black
  foreground: '#FAFAFA', // Off-white
  muted: '#94A3B8', // Gray
  cardGlass: 'rgba(255, 255, 255, 0.05)',
  borderGlass: 'rgba(255, 255, 255, 0.1)',
}

export const ANIMATION = {
  fast: 0.2, // Button hover
  normal: 0.4, // Card entrance
  slow: 0.8, // Section transitions
  scroll: 1.2, // Scroll-triggered
}

export const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '50 entries/month',
      'Basic visualizations',
      '7-day data retention',
    ],
  },
  pro: {
    name: 'Pro',
    price: 9,
    features: [
      'Unlimited entries',
      'All 21 visualizations',
      'Export data',
      'Priority AI processing',
      'Weekly email digests',
    ],
  },
}

// Emotion mapping for interactive hero
export const EMOTION_KEYWORDS: Record<string, EmotionConfig> = {
  anxious: { color: '#EF4444', speed: 2.5, chaos: 0.8, tint: '#FEE2E2' },
  worried: { color: '#EF4444', speed: 2.2, chaos: 0.7, tint: '#FEE2E2' },
  stressed: { color: '#EF4444', speed: 2.0, chaos: 0.6, tint: '#FEE2E2' },
  calm: { color: '#3B82F6', speed: 0.3, chaos: 0.1, tint: '#DBEAFE' },
  peaceful: { color: '#3B82F6', speed: 0.2, chaos: 0.05, tint: '#DBEAFE' },
  relaxed: { color: '#3B82F6', speed: 0.25, chaos: 0.08, tint: '#DBEAFE' },
  happy: { color: '#F59E0B', speed: 1.5, chaos: 0.4, tint: '#FEF3C7' },
  excited: { color: '#F59E0B', speed: 1.8, chaos: 0.5, tint: '#FEF3C7' },
  energized: { color: '#F59E0B', speed: 1.6, chaos: 0.45, tint: '#FEF3C7' },
  sad: { color: '#6B7280', speed: 0.4, chaos: 0.2, tint: '#F3F4F6' },
  tired: { color: '#6B7280', speed: 0.3, chaos: 0.15, tint: '#F3F4F6' },
  exhausted: { color: '#6B7280', speed: 0.25, chaos: 0.1, tint: '#F3F4F6' },
  hopeful: { color: '#10B981', speed: 1.0, chaos: 0.3, tint: '#D1FAE5' },
  motivated: { color: '#10B981', speed: 1.2, chaos: 0.35, tint: '#D1FAE5' },
  confused: { color: '#8B5CF6', speed: 1.4, chaos: 0.6, tint: '#EDE9FE' },
  overwhelmed: { color: '#8B5CF6', speed: 1.6, chaos: 0.7, tint: '#EDE9FE' },
}

export const DEFAULT_EMOTION: EmotionConfig = {
  color: '#6366F1',
  speed: 0.5,
  chaos: 0.2,
  tint: '#E0E7FF',
}

// Types
export interface EmotionConfig {
  color: string
  speed: number
  chaos: number
  tint: string
}
