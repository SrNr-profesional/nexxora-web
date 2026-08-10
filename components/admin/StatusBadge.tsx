import { CompanyStatus } from "@/lib/crm/types";
import { COMPANY_STATUS_LABELS } from "@/lib/crm/constants";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CompanyStatus, string> = {
  nuevo: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  contactar: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  contactado: "bg-brand-blue/15 text-brand-cyan border-brand-blue/25",
  visita_agendada: "bg-brand-blue/15 text-brand-cyan border-brand-blue/25",
  visitado: "bg-brand-purple/15 text-violet-300 border-brand-purple/25",
  interesado: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  demo: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  propuesta: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  negociacion: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  cliente: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  perdido: "bg-red-500/15 text-red-400 border-red-500/25",
};

export default function StatusBadge({ status, className }: { status: CompanyStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        STATUS_STYLES[status],
        className
      )}
    >
      {COMPANY_STATUS_LABELS[status]}
    </span>
  );
}
