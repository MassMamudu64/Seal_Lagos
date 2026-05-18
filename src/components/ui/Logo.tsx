"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  showWordmark?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * Brand mark for Seal Logistics. The PNG is pre-processed to be transparent
 * so it reads correctly on the dark canvas. Wraps in a Link by default so the
 * mark always returns visitors home.
 */
export default function Logo({
  href = "/",
  showWordmark = true,
  className,
  size = "md",
}: LogoProps) {
  const dim =
    size === "sm" ? { mark: 32, gapClass: "gap-2" }
    : size === "lg" ? { mark: 56, gapClass: "gap-3" }
    :                  { mark: 40, gapClass: "gap-2.5" };

  const content = (
    <span className={cn("inline-flex items-center", dim.gapClass, className)}>
      <span
        className="relative shrink-0"
        style={{ width: dim.mark, height: dim.mark }}
      >
        <Image
          src="/brand/logo-mark.png"
          alt="Seal Logistics mark"
          fill
          sizes={`${dim.mark}px`}
          priority
          className="object-contain"
        />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base font-semibold tracking-tight text-cloud-50">
            Seal Logistics
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-accent-400">
            Shipt et al · LLC
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="Seal Logistics — home" className="group">
      {content}
    </Link>
  );
}
