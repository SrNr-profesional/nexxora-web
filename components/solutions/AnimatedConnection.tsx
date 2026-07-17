"use client";

import { cn } from "@/lib/utils";

export default function AnimatedConnection({
  active,
  orientation = "horizontal",
  label,
  className,
}: {
  active: boolean;
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        orientation === "horizontal" ? "h-8 w-full" : "h-full w-8 flex-col",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "rounded-full bg-gradient-to-r from-brand-cyan/70 via-brand-blue/70 to-brand-purple/70 transition-opacity duration-300",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          active ? "opacity-100" : "opacity-25"
        )}
      />
      {active && (
        <span
          className={cn(
            "absolute h-2 w-2 rounded-full bg-brand-cyan shadow-glow motion-reduce:hidden",
            orientation === "horizontal" ? "top-1/2 -translate-y-1/2 animate-dot-move" : "left-1/2 -translate-x-1/2"
          )}
        />
      )}
      {label && active && (
        <span className="absolute -bottom-5 whitespace-nowrap text-[11px] font-medium text-brand-cyan animate-fade-in-up">
          {label}
        </span>
      )}
    </div>
  );
}
