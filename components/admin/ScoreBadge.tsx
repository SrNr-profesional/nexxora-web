import { computeTemperature, TEMPERATURE_META } from "@/lib/crm/scoring";
import type { Company } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export default function ScoreBadge({
  company,
  score,
  className,
}: {
  company: Company;
  score: number;
  className?: string;
}) {
  const temperature = computeTemperature(company, score);
  const meta = TEMPERATURE_META[temperature];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200", className)}>
      <span aria-hidden="true">{meta.icon}</span>
      {score}
      <span className="text-slate-500">· {meta.label}</span>
    </span>
  );
}
