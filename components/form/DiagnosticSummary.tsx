"use client";

import { ChevronDown, ClipboardCheck } from "lucide-react";
import type { DiagnosticSchema } from "@/lib/validations";

interface Props {
  values: Partial<DiagnosticSchema>;
  variant: "aside" | "collapsible";
}

function Row({ label, value }: { label: string; value?: string | string[] }) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">
        {display && display.length > 0 ? display : <span className="text-slate-600">Todavía sin completar</span>}
      </p>
    </div>
  );
}

function SummaryBody({ values }: { values: Partial<DiagnosticSchema> }) {
  return (
    <div className="space-y-3.5">
      <Row label="Restaurante" value={values.restaurantName} />
      <Row label="Tipo de negocio" value={values.businessType} />
      <Row label="Problemas" value={values.problems} />
      <Row label="Soluciones de interés" value={values.desiredFeatures} />
      <Row label="Prioridad" value={values.urgency} />
    </div>
  );
}

export default function DiagnosticSummary({ values, variant }: Props) {
  if (variant === "aside") {
    return (
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="rounded-xl2 glass p-6">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-brand-cyan" />
            <p className="text-sm font-bold text-white">Tu diagnóstico</p>
          </div>
          <SummaryBody values={values} />
        </div>
      </aside>
    );
  }

  return (
    <details className="group mb-6 rounded-xl2 glass lg:hidden">
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-2 p-4">
        <span className="flex items-center gap-2 text-sm font-bold text-white">
          <ClipboardCheck className="h-4 w-4 text-brand-cyan" />
          Tu diagnóstico
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-white/10 p-4">
        <SummaryBody values={values} />
      </div>
    </details>
  );
}
