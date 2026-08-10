"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Company, LostReason } from "@/lib/crm/types";
import { INDUSTRY_LABELS } from "@/lib/crm/constants";
import { formatCurrencyARS } from "@/lib/utils";

export default function PerdidosPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [lostReasons, setLostReasons] = useState<LostReason[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/companies?status=perdido&pageSize=500&includeArchived=true").then((r) => r.json()),
      fetch("/api/admin/lost-reasons").then((r) => r.json()),
    ]).then(([companiesRes, lostRes]) => {
      if (companiesRes.ok) setCompanies(companiesRes.companies);
      if (lostRes.ok) setLostReasons(lostRes.lostReasons);
      setLoading(false);
    });
  }, []);

  const reasonLabel = (id: string | null) => lostReasons.find((r) => r.id === id)?.label || "Sin especificar";

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    companies.forEach((c) => {
      const label = reasonLabel(c.lostReasonId);
      counts[label] = (counts[label] || 0) + 1;
    });
    const total = companies.length || 1;
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, lostReasons]);

  const lostMrr = companies.reduce((s, c) => s + c.mrrPotential, 0);

  return (
    <div className="mx-auto max-w-4xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Leads perdidos</h1>
        <p className="text-sm text-slate-500">{companies.length} oportunidad(es) perdidas · {formatCurrencyARS(lostMrr)} de MRR potencial no concretado.</p>
      </div>

      {loading ? (
        <SkeletonRows rows={5} />
      ) : (
        <>
          {stats.length > 0 && (
            <div className="mb-6 rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 text-sm font-bold text-white">Motivos de pérdida</h2>
              <div className="space-y-2.5">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-300">{s.label}</span>
                      <span className="text-slate-500">{s.pct}% ({s.count})</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} className="h-full rounded-full bg-red-500/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {companies.length === 0 ? (
            <EmptyState icon={XCircle} title="No hay leads perdidos" description="Buena señal." />
          ) : (
            <div className="space-y-2">
              {companies.map((c) => (
                <Link key={c.id} href={`/admin/empresas/${c.id}`} className="focus-ring flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-red-500/20">
                  <div>
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-xs text-slate-500">{INDUSTRY_LABELS[c.industry]} · {reasonLabel(c.lostReasonId)}</p>
                    {c.lostComment && <p className="mt-0.5 text-xs text-slate-600">&quot;{c.lostComment}&quot;</p>}
                  </div>
                  <span className="text-xs text-slate-500">{formatCurrencyARS(c.mrrPotential)}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
