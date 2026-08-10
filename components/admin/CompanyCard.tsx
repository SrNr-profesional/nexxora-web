"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Building2 } from "lucide-react";
import type { Activity, Company, Person } from "@/lib/crm/types";
import { INDUSTRY_LABELS, PRIORITY_ICON } from "@/lib/crm/constants";
import { computeScore, daysSince, lastActivityDate } from "@/lib/crm/scoring";
import { cn } from "@/lib/utils";

export default function CompanyCard({
  company,
  activities,
  people,
  profileNameById,
  dragging,
}: {
  company: Company;
  activities: Activity[];
  people: Person[];
  profileNameById: Record<string, string>;
  dragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: company.id });
  const score = computeScore(company, activities, people);
  const days = daysSince(lastActivityDate(company, activities));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-3.5 shadow-card active:cursor-grabbing",
        (isDragging || dragging) && "opacity-40"
      )}
    >
      <Link href={`/admin/empresas/${company.id}`} onClick={(e) => isDragging && e.preventDefault()} className="focus-ring block">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
              <Building2 className="h-3.5 w-3.5 text-brand-cyan" />
            </div>
            <p className="truncate text-sm font-semibold text-white">{company.name}</p>
          </div>
          <span className="flex-shrink-0 text-xs" title="Prioridad">
            {PRIORITY_ICON[company.priority]}
          </span>
        </div>

        <p className="mb-2 text-[11px] text-slate-500">{INDUSTRY_LABELS[company.industry]}</p>

        {company.mrrPotential > 0 && (
          <p className="mb-2 text-xs font-semibold text-brand-cyan">
            ${company.mrrPotential.toLocaleString("es-AR")}/mes
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Score {score}</span>
          {days !== null && <span className={days > 7 ? "text-amber-400" : ""}>{days === 0 ? "hoy" : `${days}d`}</span>}
        </div>

        {company.assignedTo && profileNameById[company.assignedTo] && (
          <p className="mt-2 text-[10px] text-slate-600">Resp: {profileNameById[company.assignedTo]}</p>
        )}
      </Link>
    </div>
  );
}
