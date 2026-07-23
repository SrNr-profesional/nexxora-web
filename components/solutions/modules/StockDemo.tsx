"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, PackageCheck, History } from "lucide-react";
import { useDemo } from "../DemoContext";
import { cn } from "@/lib/utils";

export default function StockDemo() {
  const { state } = useDemo();
  const recipeTarget = state.menu[1] ?? state.menu[0];
  const recipe = state.recipes[recipeTarget.id] || [];

  const history = useMemo(() => {
    const items = state.orders
      .slice(0, 3)
      .map((o) => `Venta #${o.id} — descuento automático de ingredientes`);
    return [...items, "Reposición de proveedor (ayer)", "Ajuste manual de stock (hace 3 días)"].slice(0, 4);
  }, [state.orders]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-white">Ingredientes — {state.name}</p>
          <PackageCheck className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
        </div>
        <div className="space-y-4">
          {state.ingredients.map((ing) => {
            const pct = Math.min(100, Math.round((ing.current / ing.max) * 100));
            const low = ing.current <= ing.min;
            return (
              <div key={ing.id}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{ing.name}</span>
                  <span className={cn("font-semibold", low ? "text-red-400" : "text-slate-400")}>
                    {ing.current} {ing.unit}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={cn("h-full rounded-full", low ? "bg-red-500" : pct < 40 ? "bg-amber-400" : "bg-brand-gradient")}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  {low ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-red-400">
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Stock bajo · se recomienda reponer mañana
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-600">Última actualización: {ing.updatedLabel}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5 shadow-card">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Descuento automático por venta</p>
          <p className="mb-2 text-sm font-semibold text-white">{recipeTarget.name}</p>
          <ul className="space-y-1.5">
            {recipe.map((r, i) => {
              const ing = state.ingredients.find((x) => x.id === r.ingredientId);
              return (
                <li key={i} className="text-xs text-slate-400">
                  {r.qty} {ing?.unit} de {ing?.name}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5 shadow-card">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <History className="h-3.5 w-3.5" aria-hidden="true" /> Historial
          </p>
          <ul className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="text-xs text-slate-400">{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
