"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Rocket } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Company, ImplementationItem } from "@/lib/crm/types";

interface ClientWithItems {
  company: Company;
  items: ImplementationItem[];
}

export default function ImplementacionesPage() {
  const [clients, setClients] = useState<ClientWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/companies?status=cliente&pageSize=500")
      .then((r) => r.json())
      .then(async (companiesRes) => {
        const list: Company[] = companiesRes.ok ? companiesRes.companies : [];
        const details = await Promise.all(list.map((c) => fetch(`/api/admin/companies/${c.id}`).then((r) => r.json())));
        setClients(
          list
            .map((c, i) => ({ company: c, items: details[i].ok ? details[i].company.implementationItems : [] }))
            .filter((c) => c.items.some((it: ImplementationItem) => !it.done))
        );
        setLoading(false);
      });
  }, []);

  const toggle = async (companyId: string, item: ImplementationItem) => {
    setClients((prev) =>
      prev.map((c) => (c.company.id === companyId ? { ...c, items: c.items.map((it) => (it.id === item.id ? { ...it, done: !it.done } : it)) } : c))
    );
    await fetch(`/api/admin/implementation-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !item.done }),
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Implementaciones</h1>
        <p className="text-sm text-slate-500">Onboarding en curso de los clientes.</p>
      </div>

      {loading ? (
        <SkeletonRows rows={4} />
      ) : clients.length === 0 ? (
        <EmptyState icon={Rocket} title="No hay implementaciones pendientes" description="Todos los clientes tienen su checklist completo." />
      ) : (
        <div className="space-y-5">
          {clients.map(({ company, items }) => {
            const doneCount = items.filter((it) => it.done).length;
            const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;
            return (
              <div key={company.id} className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{company.name}</p>
                  <span className="text-xs font-semibold text-brand-cyan">Implementación {pct}%</span>
                </div>
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggle(company.id, item)}
                      className="focus-ring flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-300 hover:bg-white/5"
                    >
                      {item.done ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" /> : <Circle className="h-4 w-4 flex-shrink-0 text-slate-600" />}
                      <span className={item.done ? "text-slate-500 line-through" : ""}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
