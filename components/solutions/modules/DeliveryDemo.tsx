"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, Store, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { useDemo } from "../DemoContext";
import { cn } from "@/lib/utils";

const DELIVERY_STEPS = ["Preparando", "Retirado por el repartidor", "En camino", "Entregado"];

export default function DeliveryDemo() {
  const { state } = useDemo();
  const [mode, setMode] = useState<"delivery" | "retiro">("delivery");
  const [stepIdx, setStepIdx] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const lastOrder = state.orders[0];
  const pickupCode = lastOrder ? `B-${lastOrder.id}` : "B-128";

  const advanceDelivery = () => setStepIdx((s) => Math.min(DELIVERY_STEPS.length - 1, s + 1));

  return (
    <div>
      <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
        <button
          onClick={() => setMode("delivery")}
          className={cn(
            "focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold",
            mode === "delivery" ? "bg-brand-gradient text-white" : "text-slate-400"
          )}
        >
          <Bike className="h-3.5 w-3.5" aria-hidden="true" /> Delivery
        </button>
        <button
          onClick={() => setMode("retiro")}
          className={cn(
            "focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold",
            mode === "retiro" ? "bg-brand-gradient text-white" : "text-slate-400"
          )}
        >
          <Store className="h-3.5 w-3.5" aria-hidden="true" /> Retiro en el local
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "delivery" ? (
          <motion.div key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 lg:grid-cols-[1fr_260px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <svg viewBox="0 0 320 140" className="w-full" role="img" aria-label="Mapa estilizado del recorrido de entrega">
                <defs>
                  <linearGradient id="route-grad" x1="0" y1="0" x2="320" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <rect width="320" height="140" rx="14" fill="rgba(255,255,255,0.03)" />
                <path d="M30 100 C 90 40, 200 120, 290 40" stroke="url(#route-grad)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                <circle cx="30" cy="100" r="6" fill="#22d3ee" />
                <circle cx="290" cy="40" r="6" fill="#8b5cf6" />
                <text x="14" y="122" fill="#94a3b8" fontSize="10">{state.name}</text>
                <text x="250" y="30" fill="#94a3b8" fontSize="10">Cliente</text>
                <motion.circle
                  r="5"
                  fill="#fef08a"
                  animate={{
                    cx: [30, 90, 160, 230, 290],
                    cy: [100, 55, 90, 55, 40],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="motion-reduce:hidden"
                />
              </svg>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
                Tiempo estimado: 8 minutos
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {DELIVERY_STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-medium",
                      i <= stepIdx ? "bg-brand-gradient text-white" : "bg-white/5 text-slate-500"
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {stepIdx < DELIVERY_STEPS.length - 1 && (
                <button
                  onClick={advanceDelivery}
                  className="focus-ring mt-4 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Avanzar estado
                </button>
              )}
            </div>

            <div className="mx-auto w-full max-w-[220px] rounded-2xl border border-white/10 bg-base-900 p-4 text-center">
              <p className="mb-2 text-[11px] text-slate-500">Notificación al cliente</p>
              <p className="text-sm font-semibold text-white">
                {stepIdx >= DELIVERY_STEPS.length - 1 ? "Tu pedido fue entregado." : `Tu pedido llega en ${8 - stepIdx * 2} minutos.`}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="retiro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-xs text-slate-500">Pedido listo</p>
            <p className="my-3 text-3xl font-bold tracking-widest text-white">{pickupCode}</p>
            <p className="text-xs text-slate-500">Hora estimada de retiro: en 10 minutos</p>

            {!confirmed ? (
              <button
                onClick={() => setConfirmed(true)}
                className="focus-ring mt-5 w-full rounded-xl bg-brand-gradient py-3 text-sm font-bold text-white shadow-glow"
              >
                Confirmar entrega
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Código validado
              </motion.div>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Sin filas innecesarias
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
