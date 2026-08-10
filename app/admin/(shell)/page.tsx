"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Sparkles,
  Phone,
  Flame,
  MonitorPlay,
  FileText,
  Handshake,
  Briefcase,
  DollarSign,
  Wallet,
  Receipt,
  ArrowRight,
} from "lucide-react";
import KpiCard from "@/components/admin/KpiCard";
import GoalProgress from "@/components/admin/GoalProgress";
import { SkeletonCards } from "@/components/admin/Skeleton";
import type { Activity, Company, Goal, Person, Profile } from "@/lib/crm/types";
import { mapGoalRow, mapProfileRow } from "@/lib/crm/mappers";
import { ACTIVE_STATUSES, PIPELINE_STAGES } from "@/lib/crm/constants";
import { buildAlerts, computeScore, recommendAction } from "@/lib/crm/scoring";
import { formatCurrencyARS } from "@/lib/utils";

function isWithinDays(iso: string, days: number) {
  return Date.now() - new Date(iso).getTime() <= days * 24 * 60 * 60 * 1000;
}

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const periodMonth = new Date().toISOString().slice(0, 7) + "-01";
    Promise.all([
      fetch("/api/admin/companies?pageSize=500").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
      fetch(`/api/admin/goals?periodMonth=${periodMonth}`).then((r) => r.json()),
    ]).then(async ([companiesRes, profilesRes, goalsRes]) => {
      const mappedCompanies: Company[] = companiesRes.ok ? companiesRes.companies : [];
      setCompanies(mappedCompanies);
      if (profilesRes.ok) setProfiles(profilesRes.profiles.map(mapProfileRow));
      if (goalsRes.ok) setGoals(goalsRes.goals.map(mapGoalRow));

      // Actividades y contactos de todas las empresas (para score/alertas/recomendaciones).
      const results = await Promise.all(
        mappedCompanies.slice(0, 300).map((c) =>
          fetch(`/api/admin/companies/${c.id}`)
            .then((r) => r.json())
            .catch(() => null)
        )
      );
      const allActivities: Activity[] = [];
      const allPeople: Person[] = [];
      results.forEach((r) => {
        if (r?.ok) {
          allActivities.push(...r.company.activities);
          allPeople.push(...r.company.people);
        }
      });
      setActivities(allActivities);
      setPeople(allPeople);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - now.getDate();

  const clientsThisMonth = companies.filter(
    (c) => c.status === "cliente" && c.clientSince && new Date(c.clientSince) >= startOfMonth
  ).length;
  const mrrTotal = companies.reduce((sum, c) => sum + (c.status === "cliente" ? c.mrrActual : 0), 0);

  const clientsGoal = goals.find((g) => g.profileId === null && g.metric === "clientes")?.target ?? 6;
  const mrrGoal = goals.find((g) => g.profileId === null && g.metric === "mrr")?.target ?? 300000;

  const activeCompanies = companies.filter((c) => !c.archived);
  const newThisWeek = activeCompanies.filter((c) => isWithinDays(c.createdAt, 7)).length;

  const kpis = useMemo(
    () => [
      { icon: Building2, label: "Prospectos totales", value: activeCompanies.length },
      { icon: Sparkles, label: "Nuevos esta semana", value: newThisWeek },
      { icon: Phone, label: "Contactados", value: activeCompanies.filter((c) => c.status !== "nuevo" && c.status !== "contactar").length },
      { icon: Flame, label: "Interesados", value: activeCompanies.filter((c) => c.status === "interesado").length },
      { icon: MonitorPlay, label: "Demos", value: activeCompanies.filter((c) => c.status === "demo").length },
      { icon: FileText, label: "Propuestas", value: activeCompanies.filter((c) => c.status === "propuesta").length },
      { icon: Handshake, label: "Negociaciones", value: activeCompanies.filter((c) => c.status === "negociacion").length },
      { icon: Briefcase, label: "Clientes", value: activeCompanies.filter((c) => c.status === "cliente").length },
      { icon: DollarSign, label: "MRR actual", value: formatCurrencyARS(mrrTotal) },
      {
        icon: Wallet,
        label: "MRR potencial",
        value: formatCurrencyARS(companies.filter((c) => ACTIVE_STATUSES.includes(c.status)).reduce((s, c) => s + c.mrrPotential, 0)),
      },
      {
        icon: Receipt,
        label: "Ticket mensual promedio",
        value: formatCurrencyARS(
          activeCompanies.filter((c) => c.status === "cliente").length > 0
            ? mrrTotal / activeCompanies.filter((c) => c.status === "cliente").length
            : 0
        ),
      },
    ],
    [activeCompanies, mrrTotal, companies, newThisWeek]
  );

  const funnel = useMemo(() => {
    const stages: { id: string; label: string; count: number }[] = [
      { id: "prospectos", label: "Prospectos", count: activeCompanies.length },
      { id: "contactados", label: "Contactados", count: activeCompanies.filter((c) => c.status !== "nuevo" && c.status !== "contactar").length },
      {
        id: "visitas",
        label: "Visitas/Reuniones",
        count: activeCompanies.filter((c) => ["visita_agendada", "visitado", "interesado", "demo", "propuesta", "negociacion", "cliente"].includes(c.status)).length,
      },
      { id: "interesados", label: "Interesados", count: activeCompanies.filter((c) => ["interesado", "demo", "propuesta", "negociacion", "cliente"].includes(c.status)).length },
      { id: "demo", label: "Demo", count: activeCompanies.filter((c) => ["demo", "propuesta", "negociacion", "cliente"].includes(c.status)).length },
      { id: "propuesta", label: "Propuesta", count: activeCompanies.filter((c) => ["propuesta", "negociacion", "cliente"].includes(c.status)).length },
      { id: "negociacion", label: "Negociación", count: activeCompanies.filter((c) => ["negociacion", "cliente"].includes(c.status)).length },
      { id: "clientes", label: "Clientes", count: activeCompanies.filter((c) => c.status === "cliente").length },
    ];
    return stages;
  }, [activeCompanies]);

  const recommendations = useMemo(() => {
    return activeCompanies
      .filter((c) => ACTIVE_STATUSES.includes(c.status))
      .map((c) => ({ company: c, score: computeScore(c, activities, people), action: recommendAction(c, activities) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [activeCompanies, activities, people]);

  const alerts = useMemo(() => buildAlerts(companies, activities, people), [companies, activities, people]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <SkeletonCards count={4} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Centro de comando Nexxora</h1>
        <p className="text-sm text-slate-500">
          {now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} · Quedan {daysRemaining} días del mes.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-brand-blue/10 via-base-900 to-brand-purple/10 p-5 shadow-card sm:p-7"
      >
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-cyan">Meta del mes</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <GoalProgress label="Clientes nuevos" current={clientsThisMonth} target={clientsGoal} />
          <GoalProgress label="MRR" current={mrrTotal} target={mrrGoal} format={(n) => formatCurrencyARS(n)} />
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Faltan {Math.max(0, clientsGoal - clientsThisMonth)} cliente(s) y {formatCurrencyARS(Math.max(0, mrrGoal - mrrTotal))} de MRR para llegar a la meta.
        </p>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {kpis.map((k) => (
          <KpiCard key={k.label} icon={k.icon} label={k.label} value={String(k.value)} />
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-card sm:p-6">
          <h2 className="mb-4 text-sm font-bold text-white">🎯 Acciones recomendadas</h2>
          {recommendations.length === 0 ? (
            <p className="text-sm text-slate-500">No hay oportunidades activas todavía.</p>
          ) : (
            <div className="space-y-2.5">
              {recommendations.map(({ company, score, action }, i) => (
                <Link
                  key={company.id}
                  href={`/admin/empresas/${company.id}`}
                  className="focus-ring flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-brand-blue/30 hover:bg-white/[0.05]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {i + 1}. {company.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{action}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs font-bold text-brand-cyan">{score}%</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-card sm:p-6">
          <h2 className="mb-4 text-sm font-bold text-white">Alertas</h2>
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-500">Todo tranquilo por ahora.</p>
          ) : (
            <div className="space-y-2.5">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
                  <span className="flex-shrink-0">{a.icon}</span>
                  {a.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Embudo de ventas</h2>
          <Link href="/admin/estadisticas" className="focus-ring flex items-center gap-1 text-xs text-brand-cyan">
            Ver estadísticas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {funnel.map((stage, i) => {
            const prev = i > 0 ? funnel[i - 1].count : stage.count;
            const conversion = prev > 0 ? Math.round((stage.count / prev) * 100) : 0;
            const widthPct = funnel[0].count > 0 ? Math.max(4, (stage.count / funnel[0].count) * 100) : 0;
            return (
              <div key={stage.id} className="flex items-center gap-3">
                <span className="w-32 flex-shrink-0 text-xs text-slate-400 sm:w-36">{stage.label}</span>
                <div className="h-7 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex h-full items-center rounded-md bg-brand-gradient px-2"
                  >
                    <span className="text-[11px] font-bold text-white">{stage.count}</span>
                  </motion.div>
                </div>
                {i > 0 && <span className="w-10 flex-shrink-0 text-right text-[11px] text-slate-500">{conversion}%</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
