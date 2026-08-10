"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Company, Profile, Task } from "@/lib/crm/types";
import { NEXT_ACTION_LABELS, TASK_TYPES_ICON } from "@/lib/crm/constants";
import { SkeletonRows } from "@/components/admin/Skeleton";
import { cn } from "@/lib/utils";

type Row =
  | { kind: "task"; id: string; date: string; title: string; assignedTo: string | null; ref: Task }
  | { kind: "company"; id: string; date: string; title: string; assignedTo: string | null; ref: Company };

function toDateOnly(iso: string) {
  return iso.slice(0, 10);
}

export default function HoyPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [me, setMe] = useState<Profile | null>(null);
  const [scope, setScope] = useState<"mine" | "team">("mine");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [tasksRes, companiesRes, profilesRes, meRes] = await Promise.all([
      fetch("/api/admin/tasks?status=pendiente").then((r) => r.json()),
      fetch("/api/admin/companies?pageSize=500").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
      fetch("/api/admin/me").then((r) => r.json()),
    ]);
    if (tasksRes.ok) setTasks(tasksRes.tasks);
    if (companiesRes.ok) setCompanies(companiesRes.companies.filter((c: Company) => !c.archived));
    if (profilesRes.ok) setProfiles(profilesRes.profiles);
    if (meRes.ok) setMe(meRes.profile);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "Sin asignar";

  const today = toDateOnly(new Date().toISOString());

  const allRows: Row[] = useMemo(() => {
    const taskRows: Row[] = tasks
      .filter((t) => t.dueDate)
      .map((t) => ({ kind: "task", id: t.id, date: t.dueDate as string, title: t.title, assignedTo: t.assignedTo, ref: t }));
    const companyRows: Row[] = companies
      .filter((c) => c.nextActionDate)
      .map((c) => ({
        kind: "company",
        id: c.id,
        date: c.nextActionDate as string,
        title: `${c.nextActionType ? NEXT_ACTION_LABELS[c.nextActionType] : "Seguimiento"} — ${c.name}`,
        assignedTo: c.nextActionAssignedTo || c.assignedTo,
        ref: c,
      }));
    return [...taskRows, ...companyRows];
  }, [tasks, companies]);

  const filtered = scope === "mine" && me ? allRows.filter((r) => r.assignedTo === me.id) : allRows;

  const overdue = filtered.filter((r) => r.date < today).sort((a, b) => a.date.localeCompare(b.date));
  const dueToday = filtered.filter((r) => r.date === today);
  const upcoming = filtered.filter((r) => r.date > today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 15);

  const completeTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/admin/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completada" }),
    });
  };

  const Section = ({ title, icon, rows, tone }: { title: string; icon: string; rows: Row[]; tone: string }) => (
    <div className="rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-card">
      <h2 className={cn("mb-4 flex items-center gap-2 text-sm font-bold", tone)}>
        <span>{icon}</span> {title}
        <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">{rows.length}</span>
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">Nada por acá.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={`${r.kind}-${r.id}`}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm"
            >
              {r.kind === "task" && (
                <button
                  onClick={() => completeTask(r.id)}
                  aria-label="Completar"
                  className="focus-ring flex-shrink-0 text-slate-500 transition-colors hover:text-emerald-400"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              )}
              <Link
                href={r.kind === "company" ? `/admin/empresas/${r.id}` : "#"}
                className="min-w-0 flex-1 truncate text-slate-200 hover:text-white"
              >
                {r.kind === "company" && r.ref.nextActionType && (
                  <span className="mr-1">{TASK_TYPES_ICON[r.ref.nextActionType]}</span>
                )}
                {r.title}
              </Link>
              <span className="flex-shrink-0 text-[11px] text-slate-500">{profileName(r.assignedTo)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <SkeletonRows rows={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Hoy</h1>
          <p className="text-sm text-slate-500">Tu centro operativo diario.</p>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {(["mine", "team"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                scope === s ? "bg-brand-gradient text-white" : "text-slate-400"
              )}
            >
              {s === "mine" ? "Mis tareas" : "Equipo"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <Section title="Vencido" icon="🔴" rows={overdue} tone="text-red-400" />
        <Section title="Hoy" icon="🟠" rows={dueToday} tone="text-amber-400" />
        <Section title="Próximos" icon="🟢" rows={upcoming} tone="text-emerald-400" />
      </div>
    </div>
  );
}
