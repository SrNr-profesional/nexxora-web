"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaLabel,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  className?: string;
}) {
  const hasDelta = typeof delta === "number" && !Number.isNaN(delta);
  const positive = hasDelta && (delta as number) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/30 sm:p-5",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        {Icon && <Icon className="h-4 w-4 text-brand-cyan" aria-hidden="true" />}
        {hasDelta && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-[11px] font-semibold",
              positive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(delta as number)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
      {deltaLabel && <p className="mt-0.5 text-[10px] text-slate-600">{deltaLabel}</p>}
    </motion.div>
  );
}
