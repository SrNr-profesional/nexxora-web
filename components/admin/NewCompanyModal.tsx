"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import Button from "@/components/ui/Button";
import { INDUSTRIES } from "@/lib/crm/constants";
import type { Company, Industry, Priority } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export default function NewCompanyModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (company: Company) => void;
}) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState<Industry>("gastronomia");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [priority, setPriority] = useState<Priority>("B");
  const [source, setSource] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!name.trim()) {
      setError("El nombre de la empresa es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, industry, city, phone, priority, source }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      onCreated(data.company);
      setName("");
      setCity("");
      setPhone("");
      setSource("");
      onClose();
    } catch (err: any) {
      setError(err.message || "No pudimos crear el prospecto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo prospecto">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Nombre de la empresa *</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
            placeholder="Ej: Burger House"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Industria</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((i) => (
              <button
                key={i.id}
                onClick={() => setIndustry(i.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  industry === i.id ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400"
                )}
              >
                {i.icon} {i.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Ciudad</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Teléfono</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Prioridad</label>
          <div className="flex gap-2">
            {(["A", "B", "C"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                  priority === p ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400"
                )}
              >
                {p === "A" ? "🔥 A" : p === "B" ? "🟡 B" : "⚪ C"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Fuente</label>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
            placeholder="Ej: Instagram, referido, prospección directa"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <Button onClick={save} disabled={saving} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear prospecto"}
        </Button>
      </div>
    </Modal>
  );
}
