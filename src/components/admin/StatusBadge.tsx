const statusStyles: Record<string, string> = {
  new: "border-accent-500/30 bg-accent-500/10 text-accent-300",
  open: "border-brand-300/30 bg-brand-400/10 text-brand-200",
  contacted: "border-brand-300/30 bg-brand-400/10 text-brand-200",
  quoted: "border-warning/30 bg-warning/10 text-warning",
  confirmed: "border-success/30 bg-success/10 text-success",
  converted: "border-success/30 bg-success/10 text-success",
  in_progress: "border-brand-300/30 bg-brand-400/10 text-brand-200",
  completed: "border-success/30 bg-success/10 text-success",
  responded: "border-success/30 bg-success/10 text-success",
  closed: "border-white/10 bg-white/5 text-cloud-300",
  cancelled: "border-danger/30 bg-danger/10 text-danger",
  archived: "border-white/10 bg-white/[0.03] text-cloud-500",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-kicker ${
        statusStyles[status] ?? "border-white/10 bg-white/5 text-cloud-300"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
