import Link from "next/link";
import { logout } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/contact", label: "Messages" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/staff", label: "Staff" },
];

export default function AdminNav() {
  return (
    <header className="mb-8 rounded-2xl border border-white/8 bg-ink-900/70 p-4 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
            Seal Logistics Admin
          </p>
          <h1 className="mt-1 font-display text-2xl text-cloud-50">Operations Desk</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-cloud-200 transition-colors hover:bg-white/10 hover:text-cloud-50"
            >
              {link.label}
            </Link>
          ))}
          <form action={logout}>
            <button className="rounded-full border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger transition-colors hover:bg-danger/15">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
