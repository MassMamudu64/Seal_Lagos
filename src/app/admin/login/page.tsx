import { login } from "@/app/admin/actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const hasError = Boolean(searchParams?.error);

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/8 bg-ink-900/80 p-8 shadow-panel">
      <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
        Admin Login
      </p>
      <h1 className="mt-3 font-display text-3xl text-cloud-50">Operations access</h1>
      <p className="mt-2 text-sm text-cloud-400">
        Enter the shared admin password to manage bookings, messages, quotes, and staff assignments.
      </p>

      <form action={login} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={searchParams?.next ?? "/admin"} />
        <label className="block">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            className="h-12 w-full rounded-xl bg-ink-950/80 px-4 text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
          />
        </label>
        {hasError && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {searchParams?.error === "config"
              ? "Admin auth is not configured. Set ADMIN_PASSWORD."
              : "That password did not match."}
          </p>
        )}
        <button className="h-11 w-full rounded-full bg-accent-500 px-6 text-sm font-semibold text-ink-950 transition-colors hover:bg-accent-400">
          Sign in
        </button>
      </form>
    </section>
  );
}
