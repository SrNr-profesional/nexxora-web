"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GoalProgress({
  label,
  current,
  target,
  format = (n: number) => String(n),
  className,
}: {
  label: string;
  current: number;
  target: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const isDone = current >= target && target > 0;

  return (
    <div className={cn("", className)}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="tabular-nums text-slate-400">
          {format(current)} / {format(target)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            isDone ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" : "bg-brand-gradient shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          )}
        />
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{pct}% de la meta</p>
    </div>
  );
}
