import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "best" | "budget" | "premium" | "legal" | "warning" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-[var(--color-accent)] text-white",
    best: "border-transparent bg-[var(--color-accent)] text-white",
    budget: "border-transparent bg-[var(--color-success)] text-white",
    premium: "border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm",
    legal: "border-transparent bg-[var(--color-success)] text-white",
    warning: "border-transparent bg-[var(--color-warning)] text-white",
    destructive: "border-transparent bg-[var(--color-danger)] text-white",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
