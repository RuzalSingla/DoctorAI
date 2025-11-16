import React from "react";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon,
  title,
  description,
  className,
  iconGradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconGradient?: string;
}) {
  return (
    <div
      role="article"
      aria-label={title}
      className={cn(
        "group relative flex flex-col items-start gap-3 rounded-xl border p-6 transition-transform duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-neutral-800 dark:bg-neutral-900",
        "bg-[var(--glass-bg)] backdrop-blur-xs",
        "neon-border card-clean neon-outline",
        className
      )}
    >
      <div
        className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-white transition-transform duration-300 group-hover:scale-105"
        style={{ background: iconGradient ?? "var(--grad-primary-secondary)" }}
      >
        {icon}
      </div>
      <h4 className="feature-title">{title}</h4>
      <p className="feature-desc">{description}</p>
    </div>
  );
}
