"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, DollarSign, Package, ShoppingBag, Clock, Users, TrendingUp, Loader2 } from "lucide-react";
import { useDemo } from "../DemoContext";
import { cn } from "@/lib/utils";
import { InsightLevel } from "@/lib/restaurantDemoData";

const SCAN_ICONS = [
  { icon: DollarSign, label: "Ventas" },
  { icon: Package, label: "Stock" },
  { icon: ShoppingBag, label: "Pedidos" },
  { icon: Clock, label: "Horarios" },
  { icon: Users, label: "Clientes" },
  { icon: TrendingUp, label: "Rentabilidad" },
];

const LEVEL_STYLES: Record<InsightLevel, { label: string; className: string }> = {
  alta: { label: "Alta prioridad", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  oportunidad: { label: "Oportunidad", className: "bg-brand-blue/15 text-brand-cyan border-brand-blue/30" },
  info: { label: "Información", className: "bg-white/10 text-slate-300 border-white/15" },
};

export default function AIAutomationDemo() {
  const { state } = useDemo();
  const [analyzing, setAnalyzing] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);

  const insights = state.orders[0]
    ? [
        { text: `Se registró un nuevo pedido (#${state.orders[0].id}) hace instantes.`, level: "info" as InsightLevel },
        ...state.aiInsights,
      ]
    : state.aiInsights;

  useEffect(() => {
    setAnalyzing(true);
    setVisibleCount(0);
    const scanTimer = window.setTimeout(() => setAnalyzing(false), 1600);
    return () => window.clearTimeout(scanTimer);
  }, [state.businessType]);

  useEffect(() => {
    if (analyzing) return;
    if (visibleCount >= insights.length) return;
    const t = window.setTimeout(() => setVisibleCount((c) => c + 1), 280);
    return () => window.clearTimeout(t);
  }, [analyzing, visibleCount, insights.length]);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-purple/10 p-6">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-brand-cyan" aria-hidden="true" />
        <p className="text-sm font-bold text-white">Nexxora Intelligence</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {SCAN_ICONS.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-3 transition-opacity",
              analyzing ? "animate-pulse-glow" : "opacity-70"
            )}
          >
            <s.icon className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
            <span className="text-[10px] text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>

      {analyzing ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Analizando datos del negocio...
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {insights.slice(0, visibleCount).map((insight, i) => (
              <motion.div
                key={insight.text + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
              >
                <p className="text-xs text-slate-200">{insight.text}</p>
                <span className={cn("flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold", LEVEL_STYLES[insight.level].className)}>
                  {LEVEL_STYLES[insight.level].label}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="mt-5 text-[11px] text-slate-600">Ejemplo ilustrativo basado en datos ficticios. No son predicciones garantizadas.</p>
    </div>
  );
}
