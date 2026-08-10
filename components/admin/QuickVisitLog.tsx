"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import Modal from "./Modal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/crm/types";

const INTEREST_OPTIONS = [
  { id: "alto", label: "Alto", icon: "🔥" },
  { id: "medio", label: "Medio", icon: "🟡" },
  { id: "bajo", label: "Bajo", icon: "⚪" },
  { id: "ninguno", label: "Ninguno", icon: "❌" },
] as const;

export default function QuickVisitLog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [selected, setSelected] = useState<Company | null>(null);
  const [talkedToDecisionMaker, setTalkedToDecisionMaker] = useState<boolean | null>(null);
  const [interest, setInterest] = useState<(typeof INTEREST_OPTIONS)[number]["id"] | null>(null);
  const [problem, setProblem] = useState("");
  const [note, setNote] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelected(null);
      setTalkedToDecisionMaker(null);
      setInterest(null);
      setProblem("");
      setNote("");
      setNextActionDate("");
      setDone(false);
    }
  }, [open]);

  useEffect(() => {
    if (!query || selected) return;
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/companies?search=${encodeURIComponent(query)}&pageSize=6`);
      const data = await res.json();
      if (data.ok) setResults(data.companies);
    }, 250);
    return () => clearTimeout(t);
  }, [query, selected]);

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const interestLabel = INTEREST_OPTIONS.find((i) => i.id === interest)?.label;
      const contentParts = [
        talkedToDecisionMaker !== null && `¿Habló con el decisor?: ${talkedToDecisionMaker ? "Sí" : "No"}`,
        interestLabel && `Interés: ${interestLabel}`,
        problem && `Problema principal: ${problem}`,
        note && note,
      ].filter(Boolean);

      await fetch(`/api/admin/companies/${selected.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "visita", content: contentParts.join(". ") || "Visita registrada." }),
      });

      if (nextActionDate) {
        await fetch(`/api/admin/companies/${selected.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nextActionType: "follow_up",
            nextActionDate,
            status: selected.status === "nuevo" || selected.status === "contactar" ? "visitado" : selected.status,
          }),
        });
      }

      setDone(true);
      setTimeout(onClose, 900);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Registrar visita">
      {done ? (
        <p className="py-6 text-center text-sm font-semibold text-emerald-400">Visita registrada ✓</p>
      ) : !selected ? (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Empresa</label>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre..."
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-1.5">
            {results.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="focus-ring flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-left text-sm text-white transition-colors hover:border-brand-blue/30"
              >
                {c.name}
                <span className="text-xs text-slate-500">{c.city}</span>
              </button>
            ))}
            {query && results.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-500">Sin resultados. Creá el prospecto primero desde Prospectos.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-white">{selected.name}</p>

          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-400">¿Hablaste con el decisor?</p>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setTalkedToDecisionMaker(v)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                    talkedToDecisionMaker === v
                      ? "border-brand-blue bg-brand-blue/15 text-white"
                      : "border-white/10 text-slate-400"
                  )}
                >
                  {v ? "Sí" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-400">Interés</p>
            <div className="grid grid-cols-4 gap-2">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setInterest(opt.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border py-2 text-[11px] font-medium transition-colors",
                    interest === opt.id ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400"
                  )}
                >
                  <span className="text-base">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Problema principal</label>
            <input
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
              placeholder="Ej: pedidos desorganizados"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Nota</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Próxima acción — fecha</label>
            <input
              type="date"
              value={nextActionDate}
              onChange={(e) => setNextActionDate(e.target.value)}
              className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
            />
          </div>

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
          </Button>
        </div>
      )}
    </Modal>
  );
}
