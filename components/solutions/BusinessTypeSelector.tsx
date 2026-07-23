"use client";

import { motion } from "framer-motion";
import { BUSINESS_TYPES, BusinessType } from "@/lib/restaurantDemoData";
import { cn } from "@/lib/utils";

export default function BusinessTypeSelector({
  value,
  onChange,
}: {
  value: BusinessType;
  onChange: (type: BusinessType) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Tipo de negocio"
      className="inline-flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
    >
      {BUSINESS_TYPES.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "focus-ring relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300",
            value === t.id ? "text-white" : "text-slate-400 hover:text-white"
          )}
        >
          {value === t.id && (
            <motion.span
              layoutId="business-type-pill"
              aria-hidden="true"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute inset-0 -z-10 rounded-full bg-brand-gradient shadow-glow"
            />
          )}
          {t.label}
        </button>
      ))}
    </div>
  );
}
