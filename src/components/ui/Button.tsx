"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-tight " +
  "rounded-full transition-colors disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-ink-950 hover:bg-accent-400 shadow-[0_10px_40px_-10px_rgba(245,130,31,0.6)]",
  secondary:
    "bg-cloud-50 text-ink-900 hover:bg-cloud-100",
  ghost:
    "bg-white/5 text-cloud-50 hover:bg-white/10 border border-white/10",
  outline:
    "bg-transparent text-cloud-50 hover:bg-white/5 border border-cloud-400/30",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

/* ----------------------------- as button ------------------------------- */

type ButtonProps = BaseProps &
  Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
    as?: "button";
    children: React.ReactNode;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth,
    className,
    iconLeft,
    iconRight,
    children,
    ...rest
  },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {iconLeft && <span className="inline-flex">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="inline-flex">{iconRight}</span>}
    </motion.button>
  );
});

export default Button;

/* ----------------------------- as link --------------------------------- */

type LinkButtonProps = BaseProps & {
  href: string;
  className?: string;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  external?: boolean;
  ariaLabel?: string;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  iconLeft,
  iconRight,
  href,
  children,
  external,
  ariaLabel,
}: LinkButtonProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  return (
    <motion.span
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      className="inline-flex"
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...externalProps}
      >
        {iconLeft && <span className="inline-flex">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="inline-flex">{iconRight}</span>}
      </Link>
    </motion.span>
  );
}
