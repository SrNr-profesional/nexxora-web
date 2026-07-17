"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ChipMultiGroup({
  label,
  options,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  error?: string;
  required?: boolean;
}) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <div>
      <label className="mb-2.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-brand-cyan">*</span>}
      </label>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              aria-pressed={active}
              className={cn(
                "focus-ring flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200",
                active
                  ? "border-brand-blue bg-brand-blue/20 text-white"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white"
              )}
            >
              {active && <Check className="h-3 w-3 text-brand-cyan" />}
              {opt}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function ChipSingleGroup({
  label,
  options,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-brand-cyan">*</span>}
      </label>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              role="radio"
              aria-checked={active}
              className={cn(
                "focus-ring rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200",
                active
                  ? "border-transparent bg-brand-gradient text-white shadow-glow"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
