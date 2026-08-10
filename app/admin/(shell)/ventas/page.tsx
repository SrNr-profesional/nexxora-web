"use client";

import { useEffect, useMemo, useState } from "react";
import KpiCard from "@/components/admin/KpiCard";
import GoalProgress from "@/components/admin/GoalProgress";
import { SkeletonCards } from "@/components/admin/Skeleton";
import Button from "@/components/ui/Button";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Receipt, Users } from "lucide-react";
import type { Company, Goal, GoalMetric, Profile } from "@/lib/crm/types";
import { ACTIVE_STATUSES, GOAL_METRIC_LABELS } from "@/lib/crm/constants";
import { formatCurrencyARS } from "@/lib/utils";

const PERIOD_MONTH = new Date().toISOString().slice(0, 7) + "-01";
const TEAM_METRICS: GoalMetric[] = ["clientes", "mrr"];
const PERSONAL_METRICS: GoalMetric[] = ["visitas", "demos", "propuestas", "prospectos", "contactos", "duenos_contactados"];

export default function VentasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      fetch("/api/admin/companies?pageSize=500").then((r) => r.json()),
      fetch(`/api/admin/goals?periodMonth=${PERIOD_MONTH}`).then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
    ]).then(([companiesRes, goalsRes, profilesRes]) => {
      if (companiesRes.ok) setCompanies(companiesRes.companies);
      if (goalsRes.ok) setGoals(goalsRes.goals);
      if (profilesRes.ok) setProfiles(profilesRes.profiles);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const clients = companies.filter((c) => c.status === "cliente");
  const mrrActual = clients.reduce((s, c) => s + c.mrrActual, 0);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const mrrNuevo = clients.filter((c) => c.clientSince && new Date(c.clientSince) >= startOfMonth).reduce((s, c) => s + c.mrrActual, 0);
  const setupCobrado = clients.reduce((s, c) => s + c.setupFeeActual, 0);
  const ticketPromedio = clients.length > 0 ? mrrActual / clients.length : 0;

  const pipeline = companies.filter((c) => ACTIVE_STATUSES.includes(c.status) && !c.archived);
  const mrrPotencialTotal = pipeline.reduce((s, c) => s + c.mrrPotential, 0);
  const mrrPonderado = pipeline.reduce((s, c) => s + (c.mrrPotential * c.probability) / 100, 0);
  const forecast = mrrActual + mrrPonderado;

  const goalFor = (profileId: string | null, metric: GoalMetric) => goals.find((g) => g.profileId === profileId && g.metric === metric)?.target || 0;

  const [editing, setEditing] = useState<Record<string, string>>({});

  const saveGoal = async (profileId: string | null, metric: GoalMetric) => {
    const key = `${profileId}-${metric}`;
    const value = Number(editing[key]);
    if (!value) return;
    await fetch("/api/admin/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, periodMonth: PERIOD_MONTH, metric, target: value }),
    });
    load();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <SkeletonCards count={4} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Ventas / MRR</h1>
        <p className="text-sm text-slate-500">Panorama financiero comercial de Nexxora.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard icon={DollarSign} label="MRR actual" value={formatCurrencyARS(mrrActual)} />
        <KpiCard icon={TrendingUp} label="MRR nuevo del mes" value={formatCurrencyARS(mrrNuevo)} />
        <KpiCard icon={TrendingDown} label="MRR perdido" value={formatCurrencyARS(0)} />
        <KpiCard icon={Wallet} label="MRR potencial" value={formatCurrencyARS(mrrPotencialTotal)} />
        <KpiCard icon={Receipt} label="Setup cobrado" value={formatCurrencyARS(setupCobrado)} />
        <KpiCard icon={Users} label="Clientes" value={String(clients.length)} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-card">
          <h2 className="mb-4 text-sm font-bold text-white">Forecast</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">MRR actual</span><span className="font-semibold text-white">{formatCurrencyARS(mrrActual)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">+ Pipeline ponderado</span><span className="font-semibold text-white">{formatCurrencyARS(mrrPonderado)}</span></div>
            <div className="my-2 h-px bg-white/10" />
            <div className="flex justify-between"><span className="text-slate-300">= Forecast</span><span className="font-bold text-brand-cyan">{formatCurrencyARS(forecast)}</span></div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Ticket mensual promedio: {formatCurrencyARS(ticketPromedio)}</p>
        </div>

        <div className="rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-card">
          <h2 className="mb-4 text-sm font-bold text-white">Pipeline ponderado por oportunidad</h2>
          <div className="max-h-52 space-y-1.5 overflow-y-auto">
            {pipeline
              .filter((c) => c.mrrPotential > 0)
              .sort((a, b) => b.mrrPotential * b.probability - a.mrrPotential * a.probability)
              .slice(0, 8)
              .map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{c.name}</span>
                  <span className="text-slate-300">
                    {formatCurrencyARS(c.mrrPotential)} × {c.probability}% = {formatCurrencyARS((c.mrrPotential * c.probability) / 100)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-card sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-white">Metas del mes</h2>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {TEAM_METRICS.map((metric) => {
            const target = goalFor(null, metric);
            const current = metric === "clientes" ? clients.filter((c) => c.clientSince && new Date(c.clientSince) >= startOfMonth).length : mrrActual;
            return (
              <div key={metric}>
                {target > 0 ? (
                  <GoalProgress label={GOAL_METRIC_LABELS[metric]} current={current} target={target} format={metric === "mrr" ? formatCurrencyARS : undefined} />
                ) : (
                  <p className="text-xs text-slate-500">Sin meta de {GOAL_METRIC_LABELS[metric].toLowerCase()} definida.</p>
                )}
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    placeholder={`Meta de ${GOAL_METRIC_LABELS[metric].toLowerCase()}`}
                    value={editing[`null-${metric}`] || ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [`null-${metric}`]: e.target.value }))}
                    className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white"
                  />
                  <Button size="sm" onClick={() => saveGoal(null, metric)}>Guardar</Button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Metas semanales por socio</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {profiles.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-sm font-semibold text-white">{p.fullName}</p>
              <div className="space-y-2">
                {PERSONAL_METRICS.map((metric) => (
                  <div key={metric} className="flex items-center gap-2">
                    <span className="w-32 flex-shrink-0 text-xs text-slate-400">{GOAL_METRIC_LABELS[metric]}</span>
                    <input
                      type="number"
                      defaultValue={goalFor(p.id, metric) || ""}
                      onChange={(e) => setEditing((prev) => ({ ...prev, [`${p.id}-${metric}`]: e.target.value }))}
                      className="focus-ring w-20 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-white"
                    />
                    <button onClick={() => saveGoal(p.id, metric)} className="focus-ring text-[11px] text-brand-cyan">
                      Guardar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
