# Pratyaksha Website Fix Plan

## 3 Phases × 3 Steps = 9 Total Steps

---

## PHASE 1: Visual Hierarchy & Readability
**Goal:** Make the site feel professional and easy to scan

### Step 1.1: Fix Typography Scale
**Files:** `Hero.tsx`, `Features.tsx`, `FinalCTA.tsx`, `globals.css`

| Element | Current | Fixed |
|---------|---------|-------|
| H1 (Hero) | `text-5xl md:text-7xl` | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` |
| H2 (Sections) | `text-4xl md:text-5xl` | `text-3xl md:text-4xl` |
| Body text | `text-muted-foreground` | `text-foreground/80` |
| Taglines | `text-xl` | `text-lg md:text-xl leading-relaxed` |

**Changes:**
- [ ] Increase H1/H2 size difference (40% gap instead of 20%)
- [ ] Switch body text from muted (#94A3B8) to foreground/80 (#FAFAFA at 80%)
- [ ] Add `leading-relaxed` to paragraphs
- [ ] Reverse gradient: "Visualized" gets gradient, not "Your Mind"

---

### Step 1.2: Fix CTA Hierarchy
**Files:** `Hero.tsx`, `Features.tsx`, `Pricing.tsx`, `button.tsx`

| Button | Current | Fixed |
|--------|---------|-------|
| Primary CTA | `size="lg"` + glow class | `size="xl"` + glow + arrow icon |
| Secondary CTA | `size="lg"` outline | `size="lg"` ghost variant |
| Pricing Primary | className override | `variant="glow"` |

**Changes:**
- [ ] Add `size="xl"` to Button component (h-14, text-lg)
- [ ] Add `variant="glow"` with built-in shadow
- [ ] Primary buttons get `<ArrowRight />` icon
- [ ] Secondary buttons use `variant="ghost"`
- [ ] Consistent labels: "Start Free Trial" everywhere

---

### Step 1.3: Fix Spacing Rhythm
**Files:** `Hero.tsx`, `Features.tsx`, `globals.css`

| Location | Current | Fixed |
|----------|---------|-------|
| Hero sections | mb-6, mb-6, mb-8, mb-8 | mb-8, mb-6, mb-8, mb-6 (alternating) |
| Bento grid gap | `gap-4` | `gap-6` |
| Section padding | `py-24` | `py-16 md:py-24` |
| Input wrapper | `p-1` | `p-2` |

**Changes:**
- [ ] Establish 8px grid: use only mb-4, mb-6, mb-8, mb-12
- [ ] Increase Bento grid gap from 16px to 24px
- [ ] Add responsive section padding
- [ ] Fix input wrapper to align with 8px grid

---

## PHASE 2: Component Consistency
**Goal:** Unify the design system

### Step 2.1: Standardize Button Variants
**Files:** `button.tsx`, then update all sections

**Add these variants to button.tsx:**
```tsx
variants: {
  variant: {
    // existing...
    glow: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.4)]",
    glass: "glass-card border-white/10 hover:bg-white/10",
    hero: "rounded-full bg-white text-indigo-900 hover:bg-indigo-100",
  },
  size: {
    // existing...
    xl: "h-14 px-8 text-lg",
  }
}
```

**Changes:**
- [ ] Add 3 new variants to button.tsx
- [ ] Add xl size to button.tsx
- [ ] Remove all Button className overrides in Hero.tsx
- [ ] Remove all Button className overrides in Features.tsx
- [ ] Remove all Button className overrides in Pricing.tsx
- [ ] Remove all Button className overrides in FinalCTA.tsx

---

### Step 2.2: Standardize Cards & Glass Effects
**Files:** `card.tsx`, `globals.css`, `BentoCard.tsx`

| Element | Current | Fixed |
|---------|---------|-------|
| shadcn Card | `rounded-xl` (12px) | `rounded-2xl` (16px) |
| glass-card | `border-radius: 1rem` | Same (16px) |
| BentoCard | `rounded-2xl` | Same (16px) |
| Glass opacity | 5% bg, 10% border | 8% bg, 15% border |

**Changes:**
- [ ] Update Card component to use `rounded-2xl`
- [ ] Increase glass-card opacity: bg 5%→8%, border 10%→15%
- [ ] Add `.glass-card-hover` with transition for interactive cards
- [ ] Remove inline style overrides for glass effects
- [ ] Create color tokens for emotion states

---

### Step 2.3: Standardize Input Component
**Files:** `input.tsx`, `Hero.tsx`, `FinalCTA.tsx`

**Add input variants:**
```tsx
const inputVariants = cva(baseStyles, {
  variants: {
    variant: {
      default: "border-input bg-background",
      hero: "bg-transparent border-0 focus-visible:ring-0",
      pill: "rounded-full bg-white/10 border-white/20",
    }
  }
})
```

**Changes:**
- [ ] Add variant system to input.tsx
- [ ] Update Hero.tsx to use `variant="hero"`
- [ ] Replace native input in FinalCTA.tsx with shadcn Input `variant="pill"`
- [ ] Ensure consistent focus states across all inputs

---

## PHASE 3: Mobile & Polish
**Goal:** Fix responsive issues and add final polish

### Step 3.1: Fix Critical Mobile Breakpoints
**Files:** `Hero.tsx`, `Features.tsx`, `HowItWorks.tsx`

| Issue | Current | Fixed |
|-------|---------|-------|
| Hero brain | `w-64 md:w-80` | `w-40 sm:w-56 md:w-72 lg:w-80` |
| Hero heading | `text-5xl md:text-7xl` | `text-3xl sm:text-4xl md:text-5xl lg:text-7xl` |
| Bento grid | `grid-cols-1 md:grid-cols-4` | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| Pricing gap | `gap-8` | `gap-4 md:gap-8` |

**Changes:**
- [ ] Add intermediate breakpoints (sm:, lg:) throughout
- [ ] Reduce 3D brain size on mobile
- [ ] Add tablet breakpoint for Bento grid (2 cols at 640px)
- [ ] Reduce vertical spacing on mobile
- [ ] Test at 360px, 390px, 768px, 1024px

---

### Step 3.2: Add Missing Interaction States
**Files:** `AgentCard.tsx`, `BentoCard.tsx`, `globals.css`

| Component | Missing | Add |
|-----------|---------|-----|
| AgentCard | Hover state | `hover:bg-white/5 transition-colors` |
| BentoCard | Focus state | `focus-visible:ring-2 focus-visible:ring-primary` |
| glass-card | Hover state | `.glass-card-interactive:hover` |
| Inputs | Error state | `aria-invalid:border-red-500` |

**Changes:**
- [ ] Add hover effect to AgentCard
- [ ] Add keyboard focus to BentoCard
- [ ] Create `.glass-card-interactive` with hover
- [ ] Add error styling to inputs
- [ ] Verify all interactive elements have visible focus

---

### Step 3.3: Final Polish & Performance
**Files:** `globals.css`, various components

| Issue | Fix |
|-------|-----|
| `transition-all` overuse | Replace with specific properties |
| Animation duration mismatch | Use constants: 150ms, 300ms, 500ms |
| Backdrop blur jank | Reduce from 16px to 12px on mobile |
| Quote icon overlap | Add padding-right to testimonial text |

**Changes:**
- [ ] Replace `transition-all` with `transition-colors`, `transition-transform`
- [ ] Standardize durations: buttons=150ms, cards=300ms, sections=500ms
- [ ] Add `@media (prefers-reduced-motion)` checks
- [ ] Fix minor visual bugs (badge position, quote overlap)
- [ ] Run Lighthouse audit, fix any remaining issues

---

## Execution Checklist

### Phase 1 (Do First - Biggest Impact)
- [ ] 1.1 Typography Scale
- [ ] 1.2 CTA Hierarchy
- [ ] 1.3 Spacing Rhythm
- [ ] **TEST: Visual hierarchy should feel clear**

### Phase 2 (Design System)
- [ ] 2.1 Button Variants
- [ ] 2.2 Cards & Glass
- [ ] 2.3 Input Component
- [ ] **TEST: Components should look unified**

### Phase 3 (Mobile & Polish)
- [ ] 3.1 Mobile Breakpoints
- [ ] 3.2 Interaction States
- [ ] 3.3 Final Polish
- [ ] **TEST: Works on all devices, feels polished**

---

## Success Metrics

After completing all phases:
- [ ] H1 is clearly larger than H2 (40%+ difference)
- [ ] Primary CTAs stand out from secondary
- [ ] Body text is easy to read (not too muted)
- [ ] All buttons use variants, no className overrides
- [ ] All cards have consistent border-radius (16px)
- [ ] Glass effects are visible but subtle
- [ ] Site works at 360px without overflow
- [ ] All interactive elements have hover + focus states
- [ ] No `transition-all` in codebase
