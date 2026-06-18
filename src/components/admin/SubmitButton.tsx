"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "danger" | "muted";
  className?: string;
};

const variants = {
  primary: "bg-accent-500 text-ink-950 hover:bg-accent-400",
  danger: "bg-danger text-white hover:bg-danger/90",
  muted: "border border-white/10 bg-white/5 text-cloud-100 hover:bg-white/10",
};

export default function SubmitButton({
  children,
  pendingLabel = "Saving...",
  variant = "primary",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
