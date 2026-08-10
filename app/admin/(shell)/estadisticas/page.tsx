"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Activity, Company, Person, Profile } from "@/lib/crm/types";
import { INDUSTRIES, INDUSTRY_LABELS } from "@/lib/crm/constants";
import { formatCurrencyARS, cn } from "@/lib/utils";

const PERIODS = ["7d", "30d", "mes_actual", "mes_anterior", "todo"] as const;
type Period = (typeof PERIODS)[number];
const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7 días",
  "30d": "30 días",
  mes_actual: "Mes actual",
  mes_anterior: "Mes anterior",
  todo: "Todo",
};

function inPeriod(dateIso: string, period: Period) {
  const date = new Date(dateIso);
  const now = new Date();
  if (period === "7d") return date >= new Date(Date.now() - 7 * 86400000);
  if (period === "30d") return date >= new Date(Date.now() - 30 * 86400000);
  if (period === "mes_actual") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  if (period === "mes_anterior") {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return date.getMonth() === prev.getMonth() && date.getFullYear() === prev.getFullYear();
  }
  return true;
}

export default function EstadisticasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("30d");
  const [industry, setIndustry] = useState("all");

  useEffect(() => {
    fetch("/api/admin/companies?pageSize=500")
      .then((r) => r.json())
      .then(async (companiesRes) => {
        const list: Company[] = companiesRes.ok ? companiesRes.companies : [];
        setCompanies(list);
        const [details, profilesRes] = await Promise.all([
          Promise.all(list.slice(0, 200).map((c) => fetch(`/api/admin/companies/${c.id}`).then((r) => r.json()))),
          fetch("/api/admin/profiles").then((r) => r.json()),
        ]);
        const acts: Activity[] = [];
        const ppl: Person[] = [];
        details.forEach((r) => {
          if (r.ok) {
            acts.push(...r.company.activities);
            ppl.push(...r.company.people);
          }
        });
        setActivities(acts);
        setPeople(ppl);
        if (profilesRes.ok) setProfiles(profilesRes.profiles);
        setLoading(false);
      });
  }, []);

  const scoped = useMemo(
    () => companies.filter((c) => !c.archived && (industry === "all" || c.industry === industry) && inPeriod(c.createdAt, period)),
    [companies, industry, period]
  );

  const funnel = useMemo(() => {
    const stages = [
      { label: "Prospectos", count: scoped.length },
      { label: "Contactados", count: scoped.filter((c) => c.status !== "nuevo" && c.status !== "contactar").length },
      { label: "Reunión/Visita", count: scoped.filter((c) => !["nuevo", "contactar", "contactado"].includes(c.status)).length },
      { label: "Demo", count: scoped.filter((c) => ["demo", "propuesta", "negociacion", "cliente"].includes(c.status)).length },
      { label: "Propuesta", count: scoped.filter((c) => ["propuesta", "negociacion", "cliente"].includes(c.status)).length },
      { label: "Cliente", count: scoped.filter((c) => c.status === "cliente").length },
    ];
    return stages;
  }, [scoped]);

  const cycleTimeDays = useMemo(() => {
    const closed = scoped.filter((c) => c.status === "cliente" && c.clientSince);
    if (closed.length === 0) return null;
    const totalDays = closed.reduce((s, c) => s + (new Date(c.clientSince!).getTime() - new Date(c.createdAt).getTime()) / 86400000, 0);
    return Math.round(totalDays / closed.length);
  }, [scoped]);

  const byIndustry = useMemo(() => {
    return INDUSTRIES.filter((i) => companies.some((c) => c.industry === i.id)).map((i) => {
      const list = companies.filter((c) => c.industry === i.id);
      const clientsList = list.filter((c) => c.status === "cliente");
      const avgTicket = clientsList.length > 0 ? clientsList.reduce((s, c) => s + c.mrrActual, 0) / clientsList.length : 0;
      return {
        industry: i,
        total: list.length,
        clients: clientsList.length,
        conversion: list.length > 0 ? Math.round((clientsList.length / list.length) * 100) : 0,
        avgTicket,
      };
    });
  }, [companies]);

  const partnerStats = useMemo(() => {
    return profiles.map((p) => {
      const visits = activities.filter((a) => a.createdBy === p.id && a.type === "visita" && inPeriod(a.createdAt, period)).length;
      const demos = activities.filter((a) => a.createdBy === p.id && a.type === "demo" && inPeriod(a.createdAt, period)).length;
      const proposals = activities.filter((a) => a.createdBy === p.id && a.type === "propuesta_enviada" && inPeriod(a.createdAt, period)).length;
      const closes = activities.filter((a) => a.createdBy === p.id && a.type === "cierre" && inPeriod(a.createdAt, period)).length;
      const prospectsFound = companies.filter((c) => c.createdBy === p.id && inPeriod(c.createdAt, period)).length;
      const calls = activities.filter((a) => a.createdBy === p.id && (a.type === "llamada" || a.type === "whatsapp") && inPeriod(a.createdAt, period)).length;
      const contactsObtained = people.filter((person) => activities.some((a) => a.companyId === person.companyId && a.createdBy === p.id)).length;
      const mrrClosed = companies.filter((c) => c.assignedTo === p.id && c.status === "cliente").reduce((s, c) => s + c.mrrActual, 0);
      return { profile: p, visits, demos, proposals, closes, prospectsFound, calls, contactsObtained, mrrClosed };
    });
  }, [profiles, activities, companies, people, period]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <SkeletonRows rows={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
          <p className="text-sm text-slate-500">Conversión, ciclo de venta y rendimiento del equipo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
            {PERIODS.map((p) => (
              <option key={p} value={p} className="bg-base-900">{PERIOD_LABELS[p]}</option>
            ))}
          </select>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
            <option value="all" className="bg-base-900">Todas las industrias</option>
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id} className="bg-base-900">{i.icon} {i.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Embudo de conversión</h2>
          {cycleTimeDays !== null && <span className="text-xs text-slate-500">Ciclo de venta promedio: {cycleTimeDays} días</span>}
        </div>
        <div className="space-y-2">
          {funnel.map((stage, i) => {
            const conversion = i > 0 && funnel[i - 1].count > 0 ? Math.round((stage.count / funnel[i - 1].count) * 100) : null;
            const widthPct = funnel[0].count > 0 ? Math.max(4, (stage.count / funnel[0].count) * 100) : 0;
            return (
              <div key={stage.label} className="flex items-center gap-3">
                <span className="w-28 flex-shrink-0 text-xs text-slate-400">{stage.label}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} className="flex h-full items-center rounded-md bg-brand-gradient px-2">
                    <span className="text-[11px] font-bold text-white">{stage.count}</span>
                  </motion.div>
                </div>
                {conversion !== null && <span className="w-10 flex-shrink-0 text-right text-[11px] text-slate-500">{conversion}%</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-bold text-white">Por industria</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">Industria</th>
                <th className="py-2">Prospectos</th>
                <th className="py-2">Clientes</th>
                <th className="py-2">Conversión</th>
                <th className="py-2">Ticket promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {byIndustry.map((row) => (
                <tr key={row.industry.id}>
                  <td className="py-2.5 text-slate-200">{row.industry.icon} {row.industry.label}</td>
                  <td className="py-2.5 text-slate-400">{row.total}</td>
                  <td className="py-2.5 text-slate-400">{row.clients}</td>
                  <td className="py-2.5 text-slate-400">{row.conversion}%</td>
                  <td className="py-2.5 text-slate-400">{formatCurrencyARS(row.avgTicket)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {partnerStats.map(({ profile, ...s }) => (
          <div key={profile.id} className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-3 text-sm font-bold text-white">{profile.fullName}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-lg font-bold text-white">{s.prospectsFound}</p><p className="text-xs text-slate-500">Prospectos encontrados</p></div>
              <div><p className="text-lg font-bold text-white">{s.calls}</p><p className="text-xs text-slate-500">Llamadas/WhatsApps</p></div>
              <div><p className="text-lg font-bold text-white">{s.visits}</p><p className="text-xs text-slate-500">Visitas realizadas</p></div>
              <div><p className="text-lg font-bold text-white">{s.demos}</p><p className="text-xs text-slate-500">Demos</p></div>
              <div><p className="text-lg font-bold text-white">{s.proposals}</p><p className="text-xs text-slate-500">Propuestas</p></div>
              <div><p className="text-lg font-bold text-white">{s.closes}</p><p className="text-xs text-slate-500">Cierres</p></div>
            </div>
            <p className="mt-3 text-xs text-slate-500">MRR cerrado: <span className="font-semibold text-brand-cyan">{formatCurrencyARS(s.mrrClosed)}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
