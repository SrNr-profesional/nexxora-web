"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import Modal from "./Modal";
import Button from "@/components/ui/Button";
import type { Company, Proposal } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export default function NewProposalModal({
  open,
  onClose,
  onCreated,
  fixedCompany,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (p: Proposal) => void;
  fixedCompany?: Company;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company | null>(fixedCompany || null);
  const [planName, setPlanName] = useState("Plan Restaurante Pro");
  const [setupFee, setSetupFee] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!query || company) return;
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/companies?search=${encodeURIComponent(query)}&pageSize=6`);
      const data = await res.json();
      if (data.ok) setResults(data.companies);
    }, 250);
    return () => clearTimeout(t);
  }, [query, company]);

  const save = async () => {
    if (!company || !planName) return;
    setSaving(true);
    const res = await fetch("/api/admin/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: company.id,
        planName,
        setupFee: Number(setupFee) || 0,
        monthlyFee: Number(monthlyFee) || 0,
        status: "enviada",
        sentDate: new Date().toISOString().slice(0, 10),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) {
      onCreated(data.proposal);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva propuesta">
      <div className="space-y-4">
        {!fixedCompany && !company ? (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Empresa</label>
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-8 pr-3 text-sm text-white" placeholder="Buscar..." />
            </div>
            <div className="space-y-1">
              {results.map((c) => (
                <button key={c.id} onClick={() => setCompany(c)} className="focus-ring block w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-white hover:border-brand-blue/30">
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm font-semibold text-white">{company?.name}</p>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Plan</label>
          <input value={planName} onChange={(e) => setPlanName(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Setup ($)</label>
            <input type="number" value={setupFee} onChange={(e) => setSetupFee(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Mensualidad ($)</label>
            <input type="number" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
          </div>
        </div>

        <Button onClick={save} disabled={saving || !company} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear y enviar"}
        </Button>
      </div>
    </Modal>
  );
}
