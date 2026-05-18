# Architecture

This document describes how Seal Logistics is built — its routing model, data flow, component architecture, animation strategy, and accessibility posture. Read [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the visual rules.

---

## 1. Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 14 (App Router)** | RSC, route-level streaming, native metadata, image optimisation |
| Language | **TypeScript** | Types on data + props prevent the entire class of "wrong rate / wrong field" bugs in a pricing-heavy site |
| Styling | **Tailwind CSS 3** | Tokens live in `tailwind.config.ts`; nothing escapes the system |
| Motion | **Framer Motion 11** | Production-grade scroll, gesture, layout and AnimatePresence APIs |
| Forms | Plain React state | No form library — flows are short, validation is per-step |
| Hosting | **Vercel** | Zero-config, Edge runtime ready |

No CMS. All copy lives in `src/lib/data.ts` so future edits are a single-file change.

## 2. Folder structure

```
src/
  app/         App Router routes — each folder is a page
  components/  All UI
    layout/    Site chrome (Header, Footer, PageTransitions, PageHeader)
    ui/        Reusable primitives (Logo, Button, Card, Icons, …)
    sections/  Composed marketing sections (Hero, ServicesGrid, CTABand, …)
  lib/         Logic + data
    data.ts    Business content
    motion.ts  Motion variants
    tracking.ts Mock shipment store
    utils.ts   Pure helpers
```

The three-tier component split — **layout / ui / sections** — keeps responsibilities clear:

- **layout** components are page-level chrome (used in `app/layout.tsx`).
- **ui** components are abstract primitives (no business semantics).
- **sections** are marketing-specific compositions (homepage Hero, Pricing calculator, etc.) that compose `ui` primitives.

## 3. Routing model

Next.js App Router. Every page is statically prerendered except `/api/track`.

| Route | Page | Notes |
| --- | --- | --- |
| `/` | Home | Hero + 6 sections |
| `/services` | Services | Page header + grid + process + CTA |
| `/schedule` | Weekly schedule | Animated route table |
| `/countries` | Network | Country grid + network diagram |
| `/pricing` | Pricing | **Interactive quote calculator** + rate sheets |
| `/tracking` | Tracking | Form, calls `/api/track` |
| `/booking` | Booking | **4-step multi-step form** |
| `/about` | Mission | Process timeline, FAQ |
| `/contact` | Contact | Offices grid, form, payment methods, footprint map |
| `/api/track` | Mock API | `GET /api/track?id=SL-...` |

Page transitions are handled by `PageTransitions.tsx` — a thin `AnimatePresence` wrapper keyed by pathname.

## 4. Data flow

```
lib/data.ts ──→ Server Components (statically resolved)
            ──→ Client Components (imported & used directly)

lib/tracking.ts ──→ app/api/track/route.ts ──→ client fetch from app/tracking/page.tsx
```

**All copy + rates** flow from `lib/data.ts`. Pricing, route tables, FAQ, services, offices, payment methods — everything you might want to edit without touching components.

**Tracking** is a mock store; in production replace the function body in `lib/tracking.ts` with a database query. The API contract (`GET /api/track?id=…` returns `{ shipment }` or `{ error }`) is stable, so swapping the data source requires no client-side change.

## 5. Component sources

The brief originally called for "UI Pro" design tokens and "21st.dev" components. Both of those CLIs require external authentication that this build environment cannot provide, so equivalents were authored in-house:

- The **"UI Pro" role** — design tokens — is fulfilled by `tailwind.config.ts` + `globals.css`. The token set is comprehensive (colour scales, type tokens, spacing, radii, shadow tokens, motion tokens, custom keyframes, custom backgrounds).
- The **"21st.dev" role** — premium components — is fulfilled by the hand-built `components/ui/` and `components/sections/` libraries. Owning these directly means they're fully tunable to the brand instead of fighting a third-party theme.

Trade-off: no external visual dependencies, but also no automatic upstream updates. For a small marketing site this is the right call; the surface is small enough to maintain in-house.

## 6. Animation strategy

Three motion patterns recur across the site:

### A. Scroll reveals

Implemented via Framer's `whileInView` with `viewportOnce` config (`{ once: true, amount: 0.2 }`). Headlines use the `staggerChildren` variant so kicker → title → lede fade up in sequence. Cards reveal in a tighter `staggerFast` cadence.

### B. Cinematic hero parallax

`useScroll({ target: ref, offset: ["start start", "end start"] })` plus `useTransform` to displace sky, aircraft and text layers at different rates. Wrapped in `useReducedMotion()` so the entire effect is bypassed for users who opt out.

### C. Layout-animated active states

`layoutId` is used in three places where an active indicator needs to slide between options:

- Header — the active nav pill
- Pricing — the unit toggle (lbs/kg) and the mode tabs
- Booking — the step underline and the unit toggle

This delivers a smooth, physical feel without bespoke spring math per component.

All variants are imported from `lib/motion.ts`. No inline easing values anywhere except hero parallax (which is genuinely one-off).

## 7. Performance budget

Production build output (`npm run build`):

```
Route (app)         Size       First Load JS
/                   7.37 kB    153 kB
/about              3.11 kB    146 kB
/booking            5.51 kB    143 kB
/contact            3.51 kB    144 kB
/countries          3.43 kB    146 kB
/pricing            6.41 kB    153 kB
/schedule           2.47 kB    145 kB
/services           792 B      147 kB
/tracking           6.25 kB    143 kB
Shared baseline     87.3 kB    (Framer + React + Next runtime)
```

Every marketing page is well under 200 kB first-load. The heaviest pages — home and pricing — both include the rich animated sections, so this is a realistic ceiling.

Images are `webp` and shipped through `next/image` with explicit `sizes`. The hero, the CTA band, and the about-page mission image are the only large media; everything else is SVG.

## 8. Accessibility

| Concern | Approach |
| --- | --- |
| Skip to content | First focusable element in `app/layout.tsx` |
| Focus rings | Global `:focus-visible` outline, accent-orange, never invisible |
| Reduced motion | Honoured site-wide via `globals.css` + per-component `useReducedMotion()` |
| Decorative SVG | Marked `aria-hidden` |
| Form labels | Every input has an explicit visible label or `aria-label` |
| Colour contrast | Body text is `cloud-100/300` on `ink-950` — both pass WCAG AA against the canvas |
| Keyboard nav | All interactive elements are reachable; mobile drawer traps focus by overlay + backdrop button |
| Heading hierarchy | One `h1` per page; sections use `h2`; cards use `h3` |
| Status announcements | The tracking page surfaces error and loading states inline (no toasts that vanish before being read) |

## 9. Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari, mobile Safari). The CSS uses `clamp()`, `aspect-ratio`, `backdrop-filter`, `:has()` (where helpful), and CSS-mask-image. These are baseline as of late 2024.

## 10. What's intentionally not here

- No dark/light mode toggle. The brand is dark.
- No analytics. Add Vercel Analytics or Plausible at deploy time.
- No i18n. All copy is English. The data shape supports adding locales later without restructuring.
- No CMS hook. Pull `lib/data.ts` into Contentful/Sanity/MDX if editors need direct access.
- No auth. Marketing surface.
