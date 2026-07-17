"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Negocio", "Operación", "Problemas", "Funciones", "Contacto"];

export default function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 sm:h-8 sm:w-8",
                  done && "bg-brand-gradient text-white",
                  active && "bg-white/10 text-white ring-2 ring-brand-blue",
                  !done && !active && "bg-white/5 text-slate-500"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span
                className={cn(
                  "hidden text-[11px] font-medium sm:block",
                  active || done ? "text-slate-300" : "text-slate-600"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-brand-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${(step / total) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
