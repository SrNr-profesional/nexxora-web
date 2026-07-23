"use client";

import { LucideIcon } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function MetricCard({
  icon: Icon,
  label,
  value,
  prefix = "",
  suffix = "",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-brand-cyan/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
      />
      <Icon className="relative mb-2 h-4 w-4 text-brand-cyan" aria-hidden="true" />
      <p className="relative text-lg font-bold text-white tabular-nums">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} duration={0.8} />
      </p>
      <p className="relative text-xs text-slate-500">{label}</p>
    </div>
  );
}
