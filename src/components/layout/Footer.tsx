import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { company, navLinks, offices, paymentMethods } from "@/lib/data";

/**
 * Footer — wide, editorial, with offices, navigation columns and payment
 * methods. Rendered as a server component since nothing here is interactive.
 */
export default function Footer() {
  return (
    <footer className="relative mt-section overflow-hidden border-t border-white/5 bg-ink-950">
      {/* Atmospheric layers */}
      <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-grid-faint opacity-30 [background-size:64px_64px]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-64 bg-radial-brand opacity-40" />

      <div className="shell relative pb-12 pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <Logo size="md" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cloud-400">
              {company.intro}
            </p>
            <p className="mt-6 font-display text-2xl italic leading-tight text-cloud-100">
              "{company.tagline}"
            </p>
          </div>

          {/* Sitemap */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-kicker text-accent-500">
              Navigate
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cloud-300 transition-colors hover:text-cloud-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/booking"
                  className="text-cloud-300 transition-colors hover:text-cloud-50"
                >
                  Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-kicker text-accent-500">
              Offices
            </h3>
            <ul className="mt-5 flex flex-col gap-4 text-sm">
              {offices.map((o) => (
                <li key={o.country}>
                  <p className="text-cloud-50">
                    <span aria-hidden className="mr-2">{o.flag}</span>
                    {o.country}
                  </p>
                  <p className="mt-1 text-xs text-cloud-400">{o.city}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-kicker text-accent-500">
              Pay With
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {paymentMethods.map((p) => (
                <li key={p.label} className="leading-snug">
                  <p className="text-cloud-100">{p.label}</p>
                  <p className="font-mono text-[12px] text-cloud-400">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-cloud-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.18em]">
            Seamless · Secure · Scheduled
          </p>
        </div>
      </div>
    </footer>
  );
}
