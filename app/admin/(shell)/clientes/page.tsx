"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Company, Profile } from "@/lib/crm/types";
import { INDUSTRY_LABELS } from "@/lib/crm/constants";
import { formatCurrencyARS } from "@/lib/utils";

export default function ClientesPage() {
  const [clients, setClients] = useState<Company[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [implementationPct, setImplementationPct] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/companies?status=cliente&pageSize=500").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
    ]).then(async ([companiesRes, profilesRes]) => {
      const list: Company[] = companiesRes.ok ? companiesRes.companies : [];
      setClients(list);
      if (profilesRes.ok) setProfiles(profilesRes.profiles);

      const details = await Promise.all(list.map((c) => fetch(`/api/admin/companies/${c.id}`).then((r) => r.json())));
      const pct: Record<string, number> = {};
      details.forEach((d, i) => {
        if (d.ok) {
          const items = d.company.implementationItems;
          pct[list[i].id] = items.length > 0 ? Math.round((items.filter((it: any) => it.done).length / items.length) * 100) : 100;
        }
      });
      setImplementationPct(pct);
      setLoading(false);
    });
  }, []);

  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "—";
  const totalMrr = clients.reduce((s, c) => s + c.mrrActual, 0);

  return (
    <div className="mx-auto max-w-[1200px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-sm text-slate-500">{clients.length} cliente(s) · {formatCurrencyARS(totalMrr)} MRR total</p>
        </div>
      </div>

      {loading ? (
        <SkeletonRows rows={5} />
      ) : clients.length === 0 ? (
        <EmptyState icon={Briefcase} title="Todavía no hay clientes" description="Cuando marqués un prospecto como cliente, va a aparecer acá." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/admin/empresas/${c.id}`}
              className="focus-ring rounded-xl2 border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-blue/30"
            >
              <p className="text-sm font-bold text-white">{c.name}</p>
              <p className="mb-3 text-xs text-slate-500">{INDUSTRY_LABELS[c.industry]} · {profileName(c.assignedTo)}</p>
              <p className="mb-3 text-lg font-bold text-brand-cyan">{formatCurrencyARS(c.mrrActual)}/mes</p>
              <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>Implementación</span>
                <span>{implementationPct[c.id] ?? 0}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-brand-gradient"
                  style={{ width: `${implementationPct[c.id] ?? 0}%` }}
                />
              </div>
              {c.clientSince && (
                <p className="mt-3 text-[11px] text-slate-600">Cliente desde {new Date(c.clientSince).toLocaleDateString("es-AR")}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
