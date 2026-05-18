# Seal Logistics

> **Seamless Shipping. Every Time.**
> A premium, cinematic Next.js website for **SHIPT ET AL LLC** — air-freight and cargo services connecting the USA, Nigeria, Liberia, Ghana, Togo, South Africa, Guinea Conakry and Gambia.

This repository is a fully production-grade Next.js 14 (App Router) project with a custom design system, Framer Motion-driven motion system, an in-house component library, a mock tracking API, a multi-step booking flow, and a two-mode quote calculator.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 14** (App Router, RSC, edge-ready) |
| Language | **TypeScript** (strict-ish, path-aliased `@/*`) |
| Styling | **Tailwind CSS 3** with a fully token-driven `tailwind.config.ts` |
| Motion | **Framer Motion 11** — every interaction shares one tokenised motion system |
| Fonts | **Fraunces** (display, italic accents), **Inter** (UI body), **JetBrains Mono** (labels) |
| Hosting | **Vercel-ready** (zero config) |

## What's inside

```
src/
  app/                       Next App Router
    layout.tsx               Root layout, fonts, header/footer mount
    page.tsx                 Home
    services/                Services page
    schedule/                Weekly air cargo schedule
    countries/               Countries we ship to
    pricing/                 Pricing + quote calculator
    tracking/                Shipment tracking lookup
    booking/                 Multi-step booking flow
    about/                   About / mission / FAQ
    contact/                 Offices, form, payments, footprint map
    api/track/route.ts       Mock tracking endpoint
    globals.css              Global stylesheet (Tailwind layers + utilities)
  components/
    layout/                  Header, Footer, PageHeader, PageTransitions
    ui/                      Logo, Button, Card, Icons, SectionHeading, Reveal
    sections/                Hero, ServicesGrid, ProcessTimeline, RouteNetwork,
                             RouteMarquee, ValuePropsBand, CTABand,
                             QuoteCalculator, BookingForm, ServiceCard
  lib/
    data.ts                  All copy/business data (single source of truth)
    motion.ts                Variants, easings, durations, springs
    tracking.ts              Mock shipment store
    utils.ts                 cn(), formatUSD(), unit conversions, clamp
public/
  brand/                     Mark, full logo, favicons
  images/                    Optimised aircraft photography (webp)
```

## Run it locally

Requirements: **Node.js 18.17+** (or 20.x), `npm` 9+.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server with HMR |
| `npm run build` | Production build (static export where possible) |
| `npm run start` | Run the built app |
| `npm run lint` | ESLint (Next.js core-web-vitals preset) |

## Deployment

**Vercel** is the path of least resistance: push this repo to GitHub, import it on vercel.com, and the framework preset auto-detects Next.js. No env vars required.

For other hosts, `npm run build` produces a `.next` directory; serve it with `npm run start` on a Node host (Fly, Render, Railway, AWS).

## Key documents

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Stack, structure, animation strategy, accessibility notes
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Colour, typography, spacing, motion tokens, component rules

## Production TODOs

These are intentionally outside the scope of the static marketing site but are listed so you can wire them up before launch:

1. **Real tracking backend.** Replace `src/lib/tracking.ts` (mock store) with a database/REST call from the existing `/api/track` route.
2. **Booking form backend.** `BookingForm.submit()` currently mints a fake reference ID. Wire it to Resend / Formspree / Sendgrid / a custom API.
3. **Contact form backend.** Same pattern as booking.
4. **Replace `metadataBase`** in `src/app/layout.tsx` with the real production URL once issued.
5. **Add a real OG image** at `public/og.png` (currently the metadata references it as a hint).
6. **Optional: switch fonts back to `next/font/google`** — the project uses runtime `<link>` tags because the build sandbox blocked Google Fonts; on Vercel you can self-host with one line.
7. **Run `npm audit`** before launch.
