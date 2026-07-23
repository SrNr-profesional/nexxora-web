"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Bell, Clock, Flame } from "lucide-react";
import { useDemo } from "../DemoContext";
import { DemoOrder, OrderStatus } from "@/lib/restaurantDemoData";
import { cn, formatCurrencyARS } from "@/lib/utils";

const COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: "nuevo", label: "Nuevos" },
  { status: "preparacion", label: "En preparación" },
  { status: "listo", label: "Listos" },
];

function elapsedLabel(createdAt: number, tick: number) {
  const mins = Math.max(0, Math.floor((tick - createdAt) / 60000));
  return `${mins} min`;
}

const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  nuevo: "Aceptar",
  preparacion: "Marcar como listo",
};

function OrderCard({ order, tick }: { order: DemoOrder; tick: number }) {
  const { advanceOrder } = useDemo();
  const mins = Math.floor((tick - order.createdAt) / 60000);
  const delayed = mins >= 12 && order.status !== "listo" && order.status !== "entregado";

  return (
    <motion.div
      layout
      layoutId={`order-${order.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-xl border p-3.5",
        order.status === "listo"
          ? "border-emerald-500/40 bg-emerald-500/5"
          : delayed
          ? "border-amber-500/40 bg-amber-500/5"
          : "border-white/10 bg-white/[0.03]"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-white">#{order.id}</span>
        <span className={cn("flex items-center gap-1 text-[11px]", delayed ? "text-amber-400" : "text-slate-500")}>
          <Clock className="h-3 w-3" aria-hidden="true" /> {elapsedLabel(order.createdAt, tick)}
        </span>
      </div>
      <p className="mb-1 text-[11px] text-slate-500">{order.channel} · {order.deliveryType}</p>
      <ul className="mb-3 space-y-0.5">
        {order.items.map((it, i) => (
          <li key={i} className="text-xs text-slate-200">
            <span className="font-semibold">{it.qty}x</span> {it.name}
            {it.extras && it.extras.length > 0 && <span className="block text-[11px] text-brand-cyan">↳ {it.extras.join(", ")}</span>}
          </li>
        ))}
      </ul>
      <p className="mb-3 text-[11px] text-slate-500">{formatCurrencyARS(order.total)}</p>
      {NEXT_ACTION[order.status] ? (
        <button
          onClick={() => advanceOrder(order.id)}
          className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-gradient py-2 text-xs font-bold text-white"
        >
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          {NEXT_ACTION[order.status]}
        </button>
      ) : order.status === "listo" ? (
        <button
          onClick={() => advanceOrder(order.id)}
          className="focus-ring w-full rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2 text-xs font-bold text-emerald-400"
        >
          Entregar
        </button>
      ) : (
        <div className="rounded-lg bg-white/5 py-2 text-center text-xs font-medium text-slate-500">Entregado</div>
      )}
    </motion.div>
  );
}

export default function KitchenDisplayDemo() {
  const { state } = useDemo();
  const [tick, setTick] = useState(() => Date.now());
  const [bellOn, setBellOn] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 15000);
    return () => window.clearInterval(id);
  }, []);

  const activeOrders = state.orders.filter((o) => o.status !== "entregado");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">Pantalla de cocina — {state.name}</p>
        <button
          onClick={() => setBellOn((v) => !v)}
          aria-pressed={bellOn}
          aria-label="Alternar alertas sonoras (desactivadas por defecto)"
          className={cn(
            "focus-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium",
            bellOn ? "border-brand-blue/40 text-brand-cyan" : "border-white/10 text-slate-500"
          )}
        >
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          {bellOn ? "Alertas activas" : "Sonido desactivado"}
        </button>
      </div>

      <LayoutGroup>
        <div className="grid gap-4 sm:grid-cols-3">
          {COLUMNS.map((col) => {
            const orders = activeOrders.filter((o) => o.status === col.status);
            return (
              <div key={col.status} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-3.5 shadow-card">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{col.label}</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">{orders.length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} tick={tick} />
                    ))}
                  </AnimatePresence>
                  {orders.length === 0 && <p className="py-6 text-center text-xs text-slate-600">Sin pedidos</p>}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
