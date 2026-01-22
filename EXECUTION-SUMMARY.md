# Pratyaksha Marketing Website - Execution Summary

## For Claude Code: Quick Start

### Prerequisites
1. **4 Video Files** in `public/videos/`:
   - `transition_1_dormant_chaos.mp4`
   - `transition_2_chaos_organizing.mp4`
   - `transition_3_organizing_illuminated.mp4`
   - `transition_4_illuminated_radiant.mp4`

2. **FFmpeg** installed (for frame extraction)
3. **cwebp** installed (for WebP conversion)

---

## Execution Steps

### Step 1: Initialize Project
```bash
cd pratyaksha-marketing
npm init -y
npm install next@latest react@latest react-dom@latest framer-motion clsx tailwind-merge
npm install -D typescript @types/node @types/react tailwindcss postcss autoprefixer ts-node
npx tailwindcss init -p
```

### Step 2: Create Directory Structure
```bash
mkdir -p public/{videos,frames/{t1,t2,t3,t4},fonts}
mkdir -p src/{app,components/{brain,navigation,overlays},hooks,lib}
mkdir -p scripts
```

### Step 3: Extract & Optimize Frames
```bash
# Run frame extraction (requires FFmpeg)
bash scripts/extract-frames.sh

# Convert to WebP (requires cwebp)
bash scripts/optimize-frames.sh

# Generate manifest
npx ts-node scripts/generate-manifest.ts
```

### Step 4: Run Development Server
```bash
npm run dev
```

---

## Key Files to Create

| Priority | File | Purpose |
|----------|------|---------|
| 1 | `scripts/extract-frames.sh` | Extract PNG frames from videos |
| 2 | `scripts/optimize-frames.sh` | Convert to WebP |
| 3 | `scripts/generate-manifest.ts` | Generate frame paths |
| 4 | `src/lib/constants.ts` | Colors, brand |
| 5 | `src/lib/content.ts` | State content/copy |
| 6 | `src/lib/animations.ts` | Framer Motion variants |
| 7 | `src/hooks/useScrollProgress.ts` | Scroll tracking |
| 8 | `src/hooks/useFramePlayer.ts` | Frame playback |
| 9 | `src/components/brain/BrainCanvas.tsx` | Main component |
| 10 | `src/components/navigation/StateNavbar.tsx` | Navigation |
| 11 | `src/components/overlays/TextOverlay.tsx` | Text content |
| 12 | `src/app/globals.css` | Global styles |
| 13 | `src/app/layout.tsx` | Layout |
| 14 | `src/app/page.tsx` | Main page |

---

## The 5 Brain States

| # | State | Navbar Label | Content Theme |
|---|-------|--------------|---------------|
| 0 | Dormant | Begin | Hero - "See what your mind has been trying to tell you" |
| 1 | Chaos | Problem | Problem - "Journaling alone doesn't reveal patterns" |
| 2 | Organizing | Solution | Solution - "AI that connects the dots" (4 agents) |
| 3 | Illuminated | Features | Features - "Your mind, visualized" (4 features) |
| 4 | Radiant | Start | CTA - "Begin your journey" |

---

## Scroll Mapping

```
Scroll Position    State    Video Playing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0%  - 20%          0        First frame of T1 (static)
20% - 40%          1        T1: Dormant → Chaos
40% - 60%          2        T2: Chaos → Organizing  
60% - 80%          3        T3: Organizing → Illuminated
80% - 100%         4        T4: Illuminated → Radiant
```

---

## Text Overlay Timing

Within each state (0-100% of state progress):
- **0-15%**: Show `beforeText` (transition intro)
- **15-85%**: Show main content (headline, subline, features)
- **85-100%**: Show `afterText` (transition outro)

---

## Design Specs

### Typography
- **Display Font**: Cal Sans SemiBold
  - Hero headline: 72px / 4.5rem
  - Section headline: 48-60px
  - Nav labels: 14px
  
- **Body Font**: Satoshi Variable
  - Sublines: 18-20px
  - Feature descriptions: 14px
  - Small text: 12px

### Colors
```css
--void: #050508           /* Background */
--dormant: #3b82f6        /* Blue glow */
--chaos: #ef4444          /* Red/orange glow */
--organizing: #8b5cf6     /* Purple glow */
--illuminated: #fbbf24    /* Gold/cyan glow */
--radiant: #ffffff        /* White glow */
```

### Glassmorphism (Cards)
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Frame rate (scroll) | 60fps desktop, 30fps mobile |
| Total frame size | < 15MB |
| Initial load | < 3MB |

---

## Verification Checklist

- [ ] Videos placed in `public/videos/`
- [ ] Frames extracted successfully
- [ ] Frames converted to WebP
- [ ] Manifest generated with correct paths
- [ ] Scroll triggers frame changes
- [ ] Navbar navigation works
- [ ] Text overlays animate correctly
- [ ] Glow colors match states
- [ ] Mobile responsive
- [ ] Loading experience smooth

---

## Fallback Strategy

If video frames are not available, the component should:
1. Show a loading state
2. Fall back to static background gradient
3. Still display text content

---

## Quick Commands Reference

```bash
# Full asset preparation
npm run prepare-assets

# Development
npm run dev

# Production build
npm run build

# Frame count check
find public/frames -name "*.webp" | wc -l

# Frame size check
du -sh public/frames
```

---

## Notes for Implementation

1. **Frame Preloading**: Preload 30 frames ahead of current position
2. **Canvas Drawing**: Use requestAnimationFrame for smooth rendering
3. **Scroll Debounce**: Use passive scroll listeners
4. **Memory Management**: Clear unused frames from cache
5. **Mobile Detection**: Reduce frame quality on mobile if needed

---

*Ready for Claude Code execution*
