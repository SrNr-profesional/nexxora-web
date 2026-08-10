"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import NewProposalModal from "@/components/admin/NewProposalModal";
import type { Proposal, ProposalStatus } from "@/lib/crm/types";
import { PROPOSAL_STATUS_LABELS } from "@/lib/crm/constants";
import { formatCurrencyARS, cn } from "@/lib/utils";

interface ProposalRow extends Proposal {
  companyName: string | null;
}

const STATUS_COLORS: Record<ProposalStatus, string> = {
  borrador: "bg-slate-500/15 text-slate-300",
  enviada: "bg-brand-blue/15 text-brand-cyan",
  vista: "bg-violet-500/15 text-violet-300",
  negociacion: "bg-amber-500/15 text-amber-400",
  aceptada: "bg-emerald-500/15 text-emerald-400",
  rechazada: "bg-red-500/15 text-red-400",
};

export default function PropuestasPage() {
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | ProposalStatus>("all");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/proposals")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setProposals(d.proposals);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const updateStatus = async (p: ProposalRow, status: ProposalStatus) => {
    setProposals((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)));
    await fetch(`/api/admin/proposals/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const filtered = statusFilter === "all" ? proposals : proposals.filter((p) => p.status === statusFilter);
  const totalOpenMrr = proposals.filter((p) => p.status === "enviada" || p.status === "negociacion").reduce((s, p) => s + p.monthlyFee, 0);

  return (
    <div className="mx-auto max-w-4xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Propuestas</h1>
          <p className="text-sm text-slate-500">{formatCurrencyARS(totalOpenMrr)} de MRR en propuestas abiertas.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Nueva propuesta
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setStatusFilter("all")} className={cn("rounded-full border px-3.5 py-1.5 text-xs font-medium", statusFilter === "all" ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400")}>
          Todas
        </button>
        {Object.entries(PROPOSAL_STATUS_LABELS).map(([id, label]) => (
          <button key={id} onClick={() => setStatusFilter(id as ProposalStatus)} className={cn("rounded-full border px-3.5 py-1.5 text-xs font-medium", statusFilter === id ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400")}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonRows rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No hay propuestas" />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <Link href={`/admin/empresas/${p.companyId}`} className="focus-ring text-sm font-semibold text-white hover:text-brand-cyan">
                  {p.companyName}
                </Link>
                <p className="text-xs text-slate-500">{p.planName} · {formatCurrencyARS(p.monthlyFee)}/mes</p>
              </div>
              <select
                value={p.status}
                onChange={(e) => updateStatus(p, e.target.value as ProposalStatus)}
                className={cn("focus-ring rounded-full border-0 px-3 py-1.5 text-xs font-semibold", STATUS_COLORS[p.status])}
              >
                {Object.entries(PROPOSAL_STATUS_LABELS).map(([id, label]) => (
                  <option key={id} value={id} className="bg-base-900 text-white">{label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <NewProposalModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={load as any} />
    </div>
  );
}
