"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Activity, Company, FeatureRequest, Person } from "@/lib/crm/types";
import { ACTIVE_STATUSES } from "@/lib/crm/constants";
import { buildAlerts, computePipelineHealth, computeProbability, computeScore, computeTemperature, recommendAction, TEMPERATURE_META } from "@/lib/crm/scoring";
import { formatCurrencyARS } from "@/lib/utils";

export default function InteligenciaPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/companies?pageSize=500")
      .then((r) => r.json())
      .then(async (companiesRes) => {
        const list: Company[] = companiesRes.ok ? companiesRes.companies.filter((c: Company) => !c.archived) : [];
        setCompanies(list);

        const [details, featuresRes] = await Promise.all([
          Promise.all(list.slice(0, 200).map((c) => fetch(`/api/admin/companies/${c.id}`).then((r) => r.json()))),
          fetch("/api/admin/feature-requests").then((r) => r.json()),
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
        if (featuresRes.ok) setFeatureRequests(featuresRes.featureRequests);
        setLoading(false);
      });
  }, []);

  const active = companies.filter((c) => ACTIVE_STATUSES.includes(c.status));

  const opportunities = useMemo(
    () =>
      active
        .map((c) => ({
          company: c,
          score: computeScore(c, activities, people),
          probability: computeProbability(c, activities, people),
          temperature: computeTemperature(c, computeScore(c, activities, people)),
          action: recommendAction(c, activities),
        }))
        .sort((a, b) => b.score - a.score),
    [active, activities, people]
  );

  const alerts = useMemo(() => buildAlerts(companies, activities, people), [companies, activities, people]);
  const health = useMemo(() => computePipelineHealth(companies, activities, people), [companies, activities, people]);

  const featureRanking = useMemo(() => {
    const counts: Record<string, number> = {};
    featureRequests.forEach((f) => (counts[f.feature] = (counts[f.feature] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [featureRequests]);

  const weeklyClosedCount = companies.filter((c) => c.status === "cliente" && c.clientSince && new Date(c.clientSince) >= new Date(Date.now() - 7 * 86400000)).length;
  const weeklyNewProspects = companies.filter((c) => new Date(c.createdAt) >= new Date(Date.now() - 7 * 86400000)).length;
  const weeklyVisits = activities.filter((a) => a.type === "visita" && new Date(a.createdAt) >= new Date(Date.now() - 7 * 86400000)).length;
  const weeklyDemos = activities.filter((a) => a.type === "demo" && new Date(a.createdAt) >= new Date(Date.now() - 7 * 86400000)).length;
  const weeklyProposals = activities.filter((a) => a.type === "propuesta_enviada" && new Date(a.createdAt) >= new Date(Date.now() - 7 * 86400000)).length;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <SkeletonRows rows={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Inteligencia comercial</h1>
        <p className="text-sm text-slate-500">Análisis calculado a partir de la actividad real del CRM — nada inventado.</p>
      </div>

      <div className="rounded-xl2 border border-brand-blue/20 bg-brand-blue/5 p-5">
        <h2 className="mb-2 text-sm font-bold text-white">Resumen de la semana</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Esta semana Nexxora agregó {weeklyNewProspects} prospecto(s), realizó {weeklyVisits} visita(s), consiguió {weeklyDemos} demo(s), envió{" "}
          {weeklyProposals} propuesta(s) {weeklyClosedCount > 0 ? `y cerró ${weeklyClosedCount} cliente(s) nuevo(s)` : "y no cerró clientes nuevos todavía"}.
        </p>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-3 text-sm font-bold text-white">Salud del pipeline</h2>
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl font-bold text-white">
            {health.score >= 70 ? "🟢" : health.score >= 40 ? "🟡" : "🔴"} {health.score}/100
          </span>
        </div>
        <ul className="space-y-1 text-xs text-slate-400">
          {health.reasons.map((r, i) => (
            <li key={i}>· {r}</li>
          ))}
        </ul>
      </div>

      {alerts.length > 0 && (
        <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-3 text-sm font-bold text-white">Alertas</h2>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-slate-300">
                <span>{a.icon}</span>
                {a.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-3 text-sm font-bold text-white">Oportunidades por temperatura</h2>
        <div className="space-y-2">
          {opportunities.map(({ company, score, probability, temperature, action }) => (
            <Link
              key={company.id}
              href={`/admin/empresas/${company.id}`}
              className="focus-ring flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm hover:border-brand-blue/30"
            >
              <div className="flex items-center gap-2">
                <span>{TEMPERATURE_META[temperature].icon}</span>
                <div>
                  <p className="font-medium text-white">{company.name}</p>
                  <p className="text-xs text-slate-500">{action}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-brand-cyan">{probability}%</span>
            </Link>
          ))}
        </div>
      </div>

      {featureRanking.length > 0 && (
        <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-3 text-sm font-bold text-white">Funcionalidades más solicitadas</h2>
          <div className="space-y-2">
            {featureRanking.map(([feature, count]) => (
              <div key={feature} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{feature}</span>
                <span className="text-xs text-slate-500">{count} pedido(s)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
