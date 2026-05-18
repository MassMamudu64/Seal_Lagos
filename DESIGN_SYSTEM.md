# Design System

The Seal Logistics design system is encoded in two places:

1. **`tailwind.config.ts`** — design tokens (colours, type, radii, shadows, animations)
2. **`src/app/globals.css`** — base styles, CSS variables, utility classes (`.shell`, `.kicker`, `.glass`, etc.)

This document is a human-readable summary so you don't have to read both files to understand the rules.

---

## 1. Aesthetic principles

The brand is **air-freight and reliability**, not consumer hype. The design language reflects that:

- **Dark cinematic canvas.** Ink-black backgrounds (`ink-950`) anchor every page. Light is used sparingly, as accent — like instrument lighting in a cockpit.
- **Editorial typography.** A serif display face (Fraunces) paired with a clean sans (Inter) and a structural mono (JetBrains Mono) for labels.
- **Orange punctuation.** The logo's orange (`accent-500 #F5821F`) appears only at high-value moments — italic headline accents, the primary CTA, the active step in a flow.
- **Motion as continuity, not decoration.** Animations exist to soften context changes (page transitions, scroll reveals, route progress) — never to surprise.

---

## 2. Colour

All colours are token-driven. Use Tailwind utilities (`bg-ink-950`, `text-accent-500`) — never hex literals in JSX.

### Brand — sampled directly from the SHIPT ET AL LLC logo PDF

| Token | Hex | Use |
| --- | --- | --- |
| `brand-500` | `#2E3092` | Logo indigo (rarely used in UI — backgrounds reserved for ambient gradient washes) |
| `brand-600` … `brand-900` | darker indigos | Subtle depth gradients |
| `accent-500` | `#F5821F` | Logo orange — primary action, italic display accents, active states |
| `accent-400` | lighter orange | Hover / glow / italic display |

### Ink (canvas)

| Token | Hex | Use |
| --- | --- | --- |
| `ink-950` | `#060A1A` | Page background |
| `ink-900` | `#0A1130` | Card / surface |
| `ink-800` | `#10183F` | Elevated surface |

### Cloud (foreground)

| Token | Hex | Use |
| --- | --- | --- |
| `cloud-50` | `#FBFCFF` | Headings, primary text |
| `cloud-100` | `#EEF1FA` | Body |
| `cloud-300/400` | `#9AA4C4` / `#7C87AD` | Muted copy, captions |
| `cloud-500` | `#5C658A` | Disabled / labels |

### Semantic

| Token | Use |
| --- | --- |
| `success` | Status dots, "delivered" |
| `warning` | "Below minimum" notices |
| `danger` | Tracking errors |

---

## 3. Typography

Three families, all loaded once in `app/layout.tsx`:

| Variable | Family | Tailwind |
| --- | --- | --- |
| `--font-sans` | **Inter** | `font-sans` (default) |
| `--font-display` | **Fraunces** | `font-display` |
| `--font-mono` | **JetBrains Mono** | `font-mono` |

### Type scale

Headings use `font-display`, fluid sizes via `clamp()` where appropriate:

- **Hero H1** — `clamp(2.75rem, 7vw, 5.75rem)`, weight 500, leading 0.98, tight tracking
- **Section H2** — `text-4xl md:text-5xl`, weight 500, leading 1.04
- **Card H3** — `text-2xl`, weight 500, leading 1.1
- **Body** — `text-base` to `text-lg`, leading-relaxed, weight 400
- **Kicker** — `text-[11px]`, uppercase, `tracking-kicker` (≈0.22em), `text-accent-500`
- **Mono labels** — `text-[11px]`, uppercase, `tracking-kicker`, `text-cloud-500`

### Italic accents

A signature pattern: short italic phrases in `text-accent-400` inside long display headlines. The italic + colour combination signals a **punctuating thought** rather than the headline's main clause. Used in moderation (1 phrase per headline).

---

## 4. Spacing & layout

- **Container.** `.shell` from `globals.css` — max-width 1280px, fluid padding (`clamp(1.25rem, 4vw, 3rem)`).
- **Vertical rhythm.** Sections use `py-section` (Tailwind custom: clamps between 5rem and 8rem). The footer top margin uses `mt-section`.
- **Grid gaps.** Card grids use `gap-4` to `gap-5`. Editorial grids with hairline separators use `gap-px`.

## 5. Radii & shadows

| Token | Use |
| --- | --- |
| `rounded-xl` | Form inputs, small chips |
| `rounded-2xl` | Cards, panels |
| `rounded-3xl` | Hero containers, CTA bands, large sections |
| `rounded-full` | Buttons, badges, status pills |

Shadow tokens in `tailwind.config.ts`:

- `shadow-glow` — accent orange aura (CTA primary)
- `shadow-lift` — hover lift for cards
- `shadow-panel` — neutral dark elevation for big surfaces
- `shadow-ring` — luminous inset border (also via `ring-inset-faint` class)

---

## 6. Motion tokens

All motion is centralised in **`src/lib/motion.ts`**. Components import variants, not raw easing values.

### Easings

| Token | Curve | Use |
| --- | --- | --- |
| `easeOut` | `[0.16, 1, 0.3, 1]` | Cinematic deceleration — entrances, scroll reveals |
| `easeSoft` | `[0.65, 0, 0.35, 1]` | Symmetric — toggles, micro-interactions |
| `spring` | stiffness 260, damping 26 | Physical — modals, interactive lifts |

### Durations

- `fast` 0.35s — micro-interactions
- `base` 0.6s — section reveals (default)
- `slow` 0.9s — hero stages

### Variants exported

`fadeUp`, `fadeIn`, `slideUp`, `slideLeft`, `slideRight`, `staggerChildren`, `staggerFast`, `scaleIn`, `smoothHover`, `modalSpring`, `parallaxLayer(rate)`.

### Accessibility

`globals.css` honours `@media (prefers-reduced-motion: reduce)` globally — every animation collapses to a 0.001ms duration. Hero parallax is explicitly disabled via `useReducedMotion()` in `Hero.tsx`.

---

## 7. Component rules

These are the rules every component is expected to follow. Linters won't catch them — code review will.

1. **No hex literals in JSX.** Always use Tailwind token utilities.
2. **No raw `style={{ background, color }}`** unless it's deriving a dynamic value (e.g. slider fill percentage).
3. **No raw `transition: 'all'`** in CSS — use Tailwind's `transition-*` utilities or Framer Motion variants.
4. **All motion goes through `lib/motion.ts`.** If you need a new variant, add it to that file; don't inline a one-off.
5. **Cards use `Card.tsx`** as the primitive, with `ring-inset-faint` for the luminous border.
6. **Buttons use `Button.tsx` / `LinkButton`** — both ship with motion-aware hover lift.
7. **All headings outside the hero use `SectionHeading`** for consistent kicker → title → lede rhythm.
8. **Every interactive element has a focus ring.** Globally set in `globals.css` via `:focus-visible` — don't override per-component.
9. **All copy lives in `lib/data.ts`** so non-technical edits never touch component code.

---

## 8. Iconography

Inline SVG icons in `src/components/ui/Icons.tsx`. Strokes use `currentColor`. Always render inside a parent that sets a colour utility (`text-accent-400`). Stroke width is 1.6 by default — never change per component.
