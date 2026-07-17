"use client";

import { RotateCcw } from "lucide-react";
import { useDemo } from "./DemoContext";

export default function DemoResetButton({ className }: { className?: string }) {
  const { reset } = useDemo();
  return (
    <button
      type="button"
      onClick={reset}
      className={`focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-medium text-slate-500 transition-colors hover:text-white ${className || ""}`}
    >
      <RotateCcw className="h-3 w-3" aria-hidden="true" />
      Reiniciar demostración
    </button>
  );
}
