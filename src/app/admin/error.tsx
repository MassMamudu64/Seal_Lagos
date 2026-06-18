"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-danger/30 bg-danger/10 p-8 text-danger shadow-panel">
      <h2 className="font-display text-2xl text-cloud-50">Admin panel error</h2>
      <p className="mt-2 text-sm">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-full bg-danger px-5 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
