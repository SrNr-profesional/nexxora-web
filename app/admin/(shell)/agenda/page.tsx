"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Plus, X } from "lucide-react";
import type { Company, Task } from "@/lib/crm/types";
import { NEXT_ACTION_LABELS } from "@/lib/crm/constants";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const VISIT_OUTCOMES = [
  { id: "visitado", label: "Visitado" },
  { id: "no_estaba", label: "No estaba el dueño" },
  { id: "cerrado", label: "Cerrado" },
  { id: "volver", label: "Volver otro día" },
  { id: "interesado", label: "Interesado" },
] as const;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function AgendaPage() {
  const [view, setView] = useState<"calendario" | "ruta">("calendario");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/companies?pageSize=500").then((r) => r.json()),
      fetch("/api/admin/tasks").then((r) => r.json()),
    ]).then(([companiesRes, tasksRes]) => {
      if (companiesRes.ok) setCompanies(companiesRes.companies.filter((c: Company) => !c.archived));
      if (tasksRes.ok) setTasks(tasksRes.tasks.filter((t: Task) => t.status !== "cancelada" && t.status !== "completada"));
    });
  }, []);

  const viewDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  }, [monthOffset]);
  const monthLabel = viewDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const days = useMemo(() => {
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startWeekday = (firstDay.getDay() + 6) % 7; // lunes=0
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = Array(startWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(`${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return cells;
  }, [viewDate]);

  const itemsForDay = (day: string) => ({
    tasks: tasks.filter((t) => t.dueDate === day),
    companies: companies.filter((c) => c.nextActionDate === day),
  });

  return (
    <div className="mx-auto max-w-4xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <p className="text-sm text-slate-500">Calendario y ruta de visitas del día.</p>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {(["calendario", "ruta"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn("rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", view === v ? "bg-brand-gradient text-white" : "text-slate-400")}
            >
              {v === "calendario" ? "Calendario" : "Ruta de hoy"}
            </button>
          ))}
        </div>
      </div>

      {view === "calendario" ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setMonthOffset((m) => m - 1)} className="focus-ring rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:text-white">←</button>
            <p className="text-sm font-semibold capitalize text-white">{monthLabel}</p>
            <button onClick={() => setMonthOffset((m) => m + 1)} className="focus-ring rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:text-white">→</button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase text-slate-500">
            {WEEKDAYS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const { tasks: dayTasks, companies: dayCompanies } = itemsForDay(day);
              const total = dayTasks.length + dayCompanies.length;
              const isToday = day === todayKey();
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex h-16 flex-col items-start rounded-lg border p-1.5 text-left transition-colors sm:h-20",
                    selectedDay === day ? "border-brand-blue bg-brand-blue/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                    isToday && "ring-1 ring-brand-cyan/50"
                  )}
                >
                  <span className={cn("text-xs", isToday ? "font-bold text-brand-cyan" : "text-slate-400")}>{Number(day.slice(-2))}</span>
                  {total > 0 && <span className="mt-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-300">{total}</span>}
                </button>
              );
            })}
          </div>

          {selectedDay && (
            <div className="mt-5 rounded-xl2 border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-sm font-semibold text-white">{new Date(selectedDay + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p>
              {itemsForDay(selectedDay).tasks.length === 0 && itemsForDay(selectedDay).companies.length === 0 ? (
                <p className="text-xs text-slate-500">Nada agendado.</p>
              ) : (
                <div className="space-y-1.5">
                  {itemsForDay(selectedDay).tasks.map((t) => (
                    <p key={t.id} className="text-xs text-slate-300">✅ {t.title}</p>
                  ))}
                  {itemsForDay(selectedDay).companies.map((c) => (
                    <Link key={c.id} href={`/admin/empresas/${c.id}`} className="focus-ring block text-xs text-slate-300 hover:text-brand-cyan">
                      {c.nextActionType && NEXT_ACTION_LABELS[c.nextActionType]} — {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <RutaDeHoy companies={companies} />
      )}
    </div>
  );
}

function RutaDeHoy({ companies }: { companies: Company[] }) {
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [outcomes, setOutcomes] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem(`nexxora_ruta_${todayKey()}`);
    if (stored) setRouteIds(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(`nexxora_ruta_${todayKey()}`, JSON.stringify(routeIds));
  }, [routeIds]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/companies?search=${encodeURIComponent(query)}&pageSize=6`);
      const data = await res.json();
      if (data.ok) setResults(data.companies);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const route = routeIds.map((id) => companies.find((c) => c.id === id)).filter(Boolean) as Company[];

  const addToRoute = (id: string) => {
    if (!routeIds.includes(id)) setRouteIds((prev) => [...prev, id]);
    setQuery("");
    setResults([]);
  };

  const markOutcome = async (company: Company, outcome: string) => {
    setOutcomes((prev) => ({ ...prev, [company.id]: outcome }));
    const label = VISIT_OUTCOMES.find((o) => o.id === outcome)?.label || outcome;
    await fetch(`/api/admin/companies/${company.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visita", content: `Ruta de hoy: ${label}.` }),
    });
    if (outcome === "cerrado") {
      await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cliente" }),
      });
    } else if (outcome === "interesado") {
      await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "interesado" }),
      });
    }
  };

  return (
    <div>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Agregar prospecto a la ruta de hoy..."
          className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-base-900 p-1.5 shadow-2xl">
            {results.map((c) => (
              <button key={c.id} onClick={() => addToRoute(c.id)} className="focus-ring flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/5">
                {c.name} <Plus className="h-3.5 w-3.5 text-brand-cyan" />
              </button>
            ))}
          </div>
        )}
      </div>

      {route.length === 0 ? (
        <p className="text-sm text-slate-500">Todavía no armaste la ruta de hoy. Buscá prospectos arriba para agregarlos.</p>
      ) : (
        <div className="space-y-3">
          {route.map((c, i) => (
            <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{i + 1}. {c.name}</p>
                  {c.address && <p className="text-xs text-slate-500">{c.address}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {c.mapsUrl && (
                    <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className="focus-ring text-slate-400 hover:text-brand-cyan">
                      <MapPin className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={() => setRouteIds((prev) => prev.filter((id) => id !== c.id))} className="focus-ring text-slate-500 hover:text-red-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {VISIT_OUTCOMES.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => markOutcome(c, o.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
                      outcomes[c.id] === o.id ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
