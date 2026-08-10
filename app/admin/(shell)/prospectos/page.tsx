"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Search, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import PriorityBadge from "@/components/admin/PriorityBadge";
import ScoreBadge from "@/components/admin/ScoreBadge";
import NewCompanyModal from "@/components/admin/NewCompanyModal";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import Button from "@/components/ui/Button";
import type { Activity, Company, Person, Profile } from "@/lib/crm/types";
import { COMPANY_STATUS_LABELS, INDUSTRIES, INDUSTRY_LABELS, PIPELINE_STAGES } from "@/lib/crm/constants";
import { computeScore, daysSince, lastActivityDate } from "@/lib/crm/scoring";
import { formatCurrencyARS } from "@/lib/utils";
import { Building2 } from "lucide-react";

export default function ProspectosPage() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [industry, setIndustry] = useState("all");
  const [status, setStatus] = useState("all");
  const [assignedTo, setAssignedTo] = useState("all");
  const [priority, setPriority] = useState("all");
  const [onlyStale, setOnlyStale] = useState(false);
  const [onlyNoFollowUp, setOnlyNoFollowUp] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (industry !== "all") params.set("industry", industry);
    if (status !== "all") params.set("status", status);
    if (assignedTo !== "all") params.set("assignedTo", assignedTo);
    if (priority !== "all") params.set("priority", priority);
    params.set("pageSize", "500");

    const [companiesRes, profilesRes] = await Promise.all([
      fetch(`/api/admin/companies?${params.toString()}`).then((r) => r.json()),
      profiles.length === 0 ? fetch("/api/admin/profiles").then((r) => r.json()) : Promise.resolve(null),
    ]);
    if (companiesRes.ok) setCompanies(companiesRes.companies);
    if (profilesRes?.ok) setProfiles(profilesRes.profiles);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, industry, status, assignedTo, priority]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  // Actividades para calcular score/días sin seguimiento (liviano: solo si hay pocas empresas).
  useEffect(() => {
    if (companies.length === 0 || companies.length > 150) return;
    Promise.all(companies.map((c) => fetch(`/api/admin/companies/${c.id}`).then((r) => r.json()))).then((results) => {
      const acts: Activity[] = [];
      const ppl: Person[] = [];
      results.forEach((r) => {
        if (r.ok) {
          acts.push(...r.company.activities);
          ppl.push(...r.company.people);
        }
      });
      setActivities(acts);
      setPeople(ppl);
    });
  }, [companies]);

  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "—";

  const filtered = useMemo(() => {
    let list = companies;
    if (onlyNoFollowUp) list = list.filter((c) => !c.nextActionDate);
    if (onlyStale) {
      list = list.filter((c) => {
        const days = daysSince(lastActivityDate(c, activities));
        return days !== null && days >= 5;
      });
    }
    return list;
  }, [companies, onlyNoFollowUp, onlyStale, activities]);

  return (
    <div className="mx-auto max-w-[1400px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Prospectos</h1>
          <p className="text-sm text-slate-500">{filtered.length} empresa(s)</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Nuevo prospecto
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="focus-ring w-48 rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-8 pr-3 text-xs text-white"
          />
        </div>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
          <option value="all" className="bg-base-900">Toda industria</option>
          {INDUSTRIES.map((i) => (
            <option key={i.id} value={i.id} className="bg-base-900">{i.icon} {i.label}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
          <option value="all" className="bg-base-900">Todo estado</option>
          {PIPELINE_STAGES.map((s) => (
            <option key={s.id} value={s.id} className="bg-base-900">{s.label}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
          <option value="all" className="bg-base-900">Toda prioridad</option>
          <option value="A" className="bg-base-900">🔥 A</option>
          <option value="B" className="bg-base-900">🟡 B</option>
          <option value="C" className="bg-base-900">⚪ C</option>
        </select>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
          <option value="all" className="bg-base-900">Todo responsable</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id} className="bg-base-900">{p.fullName}</option>
          ))}
        </select>
        <button
          onClick={() => setOnlyNoFollowUp((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${onlyNoFollowUp ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-white/10 text-slate-400"}`}
        >
          Sin próxima acción
        </button>
        <button
          onClick={() => setOnlyStale((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${onlyStale ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-white/10 text-slate-400"}`}
        >
          Atrasados
        </button>
      </div>

      {loading ? (
        <SkeletonRows rows={8} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hay prospectos con estos filtros"
          description="Probá cambiar los filtros o creá un nuevo prospecto."
          action={<Button onClick={() => setModalOpen(true)}>+ Nuevo prospecto</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Industria</th>
                <th className="px-4 py-3">Prioridad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Últ. contacto</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">MRR pot.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c) => {
                const days = daysSince(lastActivityDate(c, activities));
                const score = computeScore(c, activities, people);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/empresas/${c.id}`} className="focus-ring font-medium text-white hover:text-brand-cyan">
                        {c.name}
                      </Link>
                      {c.city && <p className="text-xs text-slate-500">{c.city}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">{INDUSTRY_LABELS[c.industry]}</td>
                    <td className="px-4 py-3.5"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3.5 text-slate-400">{profileName(c.assignedTo)}</td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {days === null ? "—" : days === 0 ? "Hoy" : `Hace ${days}d`}
                      {!c.nextActionDate && c.status !== "cliente" && c.status !== "perdido" && (
                        <AlertTriangle className="ml-1 inline h-3 w-3 text-amber-400" />
                      )}
                    </td>
                    <td className="px-4 py-3.5"><ScoreBadge company={c} score={score} /></td>
                    <td className="px-4 py-3.5 font-medium text-white">{formatCurrencyARS(c.mrrPotential)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NewCompanyModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={(c) => setCompanies((prev) => [c, ...prev])} />
    </div>
  );
}
