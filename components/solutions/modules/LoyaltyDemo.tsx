"use client";

import { motion } from "framer-motion";
import { Star, Gift, ShoppingBag, ArrowRight, UserPlus, UserCheck, UserX, Cake } from "lucide-react";
import { useDemo } from "../DemoContext";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const SEGMENTS = [
  { label: "Cliente nuevo", icon: UserPlus, desc: "Primera compra en los últimos 15 días" },
  { label: "Cliente frecuente", icon: UserCheck, desc: "3 o más pedidos en el último mes" },
  { label: "Cliente inactivo", icon: UserX, desc: "Sin compras hace más de 30 días" },
  { label: "Cumpleaños próximo", icon: Cake, desc: "Oportunidad para un beneficio especial" },
];

export default function LoyaltyDemo() {
  const { state } = useDemo();
  const unlocked = state.customer.points >= 300;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
            {state.customer.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{state.customer.name}</p>
            <p className="text-xs text-slate-500">{state.customer.level} · {state.customer.ordersCount} pedidos</p>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-xs text-slate-400">Puntos acumulados</span>
          </div>
          <span className="text-xl font-bold text-white tabular-nums">
            <AnimatedCounter value={state.customer.points} duration={0.8} />
          </span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-slate-500">Producto favorito</p>
            <p className="mt-1 font-semibold text-white">{state.customer.favorite}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-slate-500">Última compra</p>
            <p className="mt-1 font-semibold text-white">{state.customer.lastPurchase}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-3 text-[11px] text-slate-400">
          <ShoppingBag className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" /> Compra realizada
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
          <Star className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" /> Puntos acumulados
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
          <Gift className="h-3.5 w-3.5 text-brand-purple" aria-hidden="true" /> Beneficio desbloqueado
        </div>

        {unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center"
          >
            <p className="text-sm font-bold text-emerald-400">Cupón desbloqueado</p>
            <p className="text-xs text-slate-300">10% de descuento en tu próxima compra</p>
          </motion.div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-6 shadow-card">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Cómo Nexxora segmenta a tus clientes</p>
        <ul className="space-y-3">
          {SEGMENTS.map((s) => (
            <li key={s.label} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <s.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-cyan" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-white">{s.label}</p>
                <p className="text-[11px] text-slate-500">{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-slate-600">
          Ejemplo ilustrativo de segmentación. Nexxora no envía campañas de forma automática sin tu aprobación.
        </p>
      </div>
    </div>
  );
}
