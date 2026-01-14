# Pratyaksha Marketing Website

> **"See Your Mind. Clearly."**

The official marketing website for [Pratyaksha](https://pratyaksha.app) — an AI-powered cognitive journaling platform that transforms raw thoughts into actionable self-insight.

---

## What is Pratyaksha?

Pratyaksha is a cognitive journaling dashboard that uses a **4-agent AI pipeline** to analyze journal entries in real-time. Unlike traditional journaling apps, Pratyaksha doesn't just store your thoughts — it reveals patterns, contradictions, and insights you've never seen before.

### The 4-Agent AI Pipeline

| Agent | Purpose | Output |
|-------|---------|--------|
| **Intent Agent** | Classifies entry type (Emotional, Cognitive, Work, Health, etc.) | Entry type, key phrases, snapshot |
| **Emotion Agent** | Analyzes mood, energy level, and emotional patterns | Mode (Anxious, Calm, Hopeful...), energy shape |
| **Theme Agent** | Identifies recurring themes and internal conflicts | Theme tags, contradictions, loops |
| **Insight Agent** | Generates actionable recommendations | Summary, insights, next action |

### 21 Visualizations

The dashboard includes powerful visualizations:

- **Emotional Timeline** — Track emotional patterns over time
- **Energy Radar** — Multi-dimensional energy visualization
- **GitHub-Style Heatmap** — Journaling consistency at a glance
- **Sankey Flow** — Trace emotional transitions
- **Contradiction Tracker** — Identify internal conflicts
- **Mode Distribution** — Balance of emotional states
- And 15 more...

---

## About This Repository

This repository contains the **marketing website** — an immersive, 3D-animated landing page designed to showcase Pratyaksha's capabilities and convert visitors into users.

### Key Features

- **Interactive 3D Brain** — React Three Fiber powered brain that responds to emotional keywords typed in real-time
- **Scroll Storytelling** — Apple-style scroll animations that walk visitors through the 4-agent pipeline
- **Bento Grid Showcase** — Live preview of all 21 chart visualizations
- **Science Section** — CBT-inspired credibility with privacy-first messaging

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **3D Graphics** | React Three Fiber + drei |
| **Animations** | GSAP ScrollTrigger + Framer Motion |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Micro-animations** | Lottie |
| **Analytics** | PostHog + Google Analytics 4 |
| **Email** | Resend |
| **Deployment** | Google Cloud Run |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/CryptoPrism-io/pratyaksha-website.git
cd pratyaksha-website

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

### Development

```bash
# Start development server
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Run production build locally
npm start
```

---

## Project Structure

```
pratyaksha-website/
├── public/
│   ├── models/              # 3D GLB models (brain)
│   ├── images/              # Static images and screenshots
│   └── animations/          # Frame sequences for scroll animations
│
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout with fonts/providers
│   │   └── page.tsx         # Main landing page
│   │
│   ├── components/
│   │   ├── 3d/              # Three.js components
│   │   │   ├── Brain.tsx    # 3D brain model
│   │   │   ├── HeroScene.tsx
│   │   │   └── NeuralConnections.tsx
│   │   │
│   │   ├── sections/        # Page sections
│   │   │   ├── Hero.tsx         # Interactive hero with 3D brain
│   │   │   ├── HowItWorks.tsx   # 4-agent scroll storytelling
│   │   │   ├── Features.tsx     # Bento grid chart showcase
│   │   │   ├── Science.tsx      # CBT credibility section
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── FinalCTA.tsx
│   │   │
│   │   ├── bento/           # Bento grid components
│   │   ├── pipeline/        # 4-agent pipeline components
│   │   ├── diagrams/        # Neural pipeline diagram
│   │   └── ui/              # shadcn/ui components
│   │
│   ├── hooks/
│   │   └── useEmotionAnalysis.ts  # Real-time keyword detection
│   │
│   └── lib/
│       ├── constants.ts     # Color palettes, emotion mappings
│       └── utils.ts         # Utility functions
│
├── Dockerfile               # Production container
├── cloudbuild.yaml          # GCP Cloud Build config
└── ...
```

---

## Environment Variables

Create a `.env.local` file with the following:

```bash
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site
NEXT_PUBLIC_SITE_URL=https://pratyaksha.app

# Email (for waitlist)
RESEND_API_KEY=re_xxx
```

---

## Deployment

### Google Cloud Run

```bash
# Deploy to Cloud Run
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions="_NEXT_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY,_RESEND_API_KEY=$RESEND_API_KEY"

# Service URL
https://pratyaksha-website-xxxxx.run.app
```

### Custom Domain

The production site is deployed at: **https://pratyaksha.app**

---

## Website Sections

| Section | Description |
|---------|-------------|
| **Hero** | Interactive 3D brain that reacts to typed emotions (anxious, calm, happy, hopeful) |
| **How It Works** | Scroll-driven animation showing the 4-agent pipeline processing a sample entry |
| **Features** | Bento grid showcasing 8 chart types (21 total in the product) |
| **Science** | CBT credibility, neural pipeline diagram, privacy badges |
| **Testimonials** | Social proof from early users |
| **Pricing** | Free tier ($0) and Pro tier ($9/mo) |
| **Final CTA** | Waitlist signup with email capture |

---

## Design Principles

1. **Show, Don't Tell** — Interactive demos over static descriptions
2. **Progressive Disclosure** — Reveal complexity through scroll
3. **Emotion-Responsive** — UI reacts to user's emotional input
4. **Privacy-First Messaging** — Emphasize user data ownership
5. **Science-Backed Credibility** — CBT foundations without medical claims

---

## Related Repositories

| Repository | Description |
|------------|-------------|
| [pratyaksha](https://github.com/CryptoPrism-io/pratyaksha) | Main dashboard application (React + Express) |

---

## Contributing

This is a private project. For internal contributors:

1. Create a feature branch from `main`
2. Make changes and test locally
3. Submit a PR for review

---

## License

Private — All rights reserved.

---

## Links

- **Live Website**: https://pratyaksha.app
- **Dashboard**: https://pratyaksha-963362833537.asia-south1.run.app
- **Documentation**: See `/docs/product/` in the main repository
