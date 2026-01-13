# Pratyaksha Marketing Website

**"See Your Mind. Clearly."**

A stunning 3D marketing website for Pratyaksha - the AI-powered cognitive journaling dashboard.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **3D:** React Three Fiber + drei
- **Animations:** GSAP ScrollTrigger + Framer Motion + Lottie
- **Styling:** Tailwind CSS + shadcn/ui
- **Analytics:** PostHog + Google Analytics 4
- **Deployment:** Google Cloud Run

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

## Project Structure

```
pratyaksha-website/
├── public/
│   ├── models/          # 3D GLB models
│   ├── images/          # Static images
│   └── animations/      # Frame sequences
├── src/
│   ├── app/             # Next.js app router
│   ├── components/
│   │   ├── sections/    # Page sections (Hero, Features, etc.)
│   │   ├── 3d/          # Three.js components
│   │   ├── bento/       # Bento grid components
│   │   ├── pipeline/    # 4-Agent pipeline components
│   │   └── ui/          # shadcn/ui components
│   ├── assets/lottie/   # Lottie JSON files
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and constants
├── Dockerfile
├── cloudbuild.yaml
└── ...
```

## The 4 Phases

1. **Interactive Hero** - Thought-reactive 3D brain
2. **Pipeline Storytelling** - Apple-style scroll animation
3. **Bento Showcase** - 21 charts live preview
4. **Trust + CTA** - Credibility + conversion

## Deployment

```bash
# Deploy to Cloud Run
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions="_NEXT_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY,_RESEND_API_KEY=$RESEND_API_KEY"
```

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://pratyaksha.app
RESEND_API_KEY=re_xxx
```

## Documentation

See detailed specs in `../Pratyaksha/dashboard/docs/product/milestone-4.1/`:

- `README.md` - Overview
- `phase-1-hero.md` - Interactive Hero specs
- `phase-2-pipeline.md` - Pipeline animation specs
- `phase-3-bento.md` - Bento grid specs
- `phase-4-trust.md` - Trust section specs
- `assets-inventory.md` - Complete asset list
- `technical-spec.md` - Technical implementation

## License

Private - All rights reserved
