import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { getDashboardCounts } from "@/lib/admin/data";

const cards = [
  { key: "bookings", label: "Bookings", href: "/admin/bookings" },
  { key: "contactMessages", label: "Contact Messages", href: "/admin/contact" },
  { key: "quotes", label: "Quotes", href: "/admin/quotes" },
  { key: "activeStaff", label: "Active Staff", href: "/admin/staff" },
] as const;

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  return (
    <>
      <AdminNav />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel transition-colors hover:bg-ink-900"
          >
            <p className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
              {card.label}
            </p>
            <p className="mt-4 font-display text-4xl text-cloud-50">{counts[card.key]}</p>
          </Link>
        ))}
      </section>
      <section className="mt-8 rounded-2xl border border-white/8 bg-ink-900/60 p-6 text-sm leading-relaxed text-cloud-300 shadow-panel">
        <h2 className="font-display text-2xl text-cloud-50">Today&apos;s Workflow</h2>
        <p className="mt-3">
          Review new submissions, assign them to active staff, update statuses as follow-up happens,
          and keep internal notes attached to each operational record.
        </p>
      </section>
    </>
  );
}
