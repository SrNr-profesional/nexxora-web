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
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <Icon className="mb-2 h-4 w-4 text-brand-cyan" aria-hidden="true" />
      <p className="text-lg font-bold text-white tabular-nums">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} duration={0.8} />
      </p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
