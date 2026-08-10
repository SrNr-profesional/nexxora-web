"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Activity, Company, Person } from "@/lib/crm/types";
import CompanyCard from "./CompanyCard";
import { formatCurrencyARS } from "@/lib/utils";

export default function KanbanColumn({
  id,
  label,
  companies,
  activities,
  people,
  profileNameById,
}: {
  id: string;
  label: string;
  companies: Company[];
  activities: Activity[];
  people: Person[];
  profileNameById: Record<string, string>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const mrrSum = companies.reduce((s, c) => s + (c.mrrPotential || 0), 0);

  return (
    <div className="flex w-72 flex-shrink-0 flex-col">
      <div className="mb-2.5 flex items-center justify-between px-1">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">{companies.length}</span>
      </div>
      {mrrSum > 0 && <p className="mb-2 px-1 text-[11px] text-slate-600">{formatCurrencyARS(mrrSum)}</p>}
      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-1 flex-col gap-2.5 rounded-xl border p-2 transition-colors ${
          isOver ? "border-brand-blue/40 bg-brand-blue/[0.03]" : "border-white/5 bg-white/[0.015]"
        }`}
      >
        <SortableContext items={companies.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} activities={activities} people={people} profileNameById={profileNameById} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
