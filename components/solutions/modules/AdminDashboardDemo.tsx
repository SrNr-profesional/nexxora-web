"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, ShoppingBag, Receipt, TrendingUp, AlertTriangle, Trophy } from "lucide-react";
import { useDemo } from "../DemoContext";
import MetricCard from "../MetricCard";
import { formatCurrencyARS } from "@/lib/utils";

const PIE_COLORS = ["#22d3ee", "#3b82f6", "#7c3aed", "#8b5cf6"];

export default function AdminDashboardDemo() {
  const { state } = useDemo();
  const avgTicket = Math.round(state.salesToday / Math.max(1, state.ordersToday));

  const hourlyData = useMemo(
    () => state.hourlySales.map((v, i) => ({ hour: `${11 + i}h`, ventas: v })),
    [state.hourlySales]
  );

  const lowStock = state.ingredients.filter((i) => i.current <= i.min);
  const delayedOrders = state.orders.filter((o) => o.status !== "listo" && o.status !== "entregado" && Date.now() - o.createdAt > 12 * 60000);
  const outOfStock = state.menu.filter((m) => !m.available);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-sm font-bold text-white">{state.name} — Panel en vivo</p>
        <span className="text-[11px] text-slate-500">Datos ficticios de ejemplo</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard icon={DollarSign} label="Ventas de hoy" value={state.salesToday} prefix="$" />
        <MetricCard icon={ShoppingBag} label="Pedidos" value={state.ordersToday} />
        <MetricCard icon={Receipt} label="Ticket promedio" value={avgTicket} prefix="$" />
        <MetricCard icon={TrendingUp} label="Crecimiento semanal" value={state.weeklyGrowth} suffix="%" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Ventas por hora</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#0d1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(v: number) => [formatCurrencyARS(v), "Ventas"]}
              />
              <Bar dataKey="ventas" radius={[6, 6, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Comparación semanal</p>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={state.weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#0d1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(v: number) => formatCurrencyARS(v)}
              />
              <Line type="monotone" dataKey="anterior" stroke="#475569" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Pedidos por canal</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={state.channelSplit} dataKey="value" nameKey="channel" innerRadius={28} outerRadius={48} paddingAngle={2}>
                  {state.channelSplit.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0d1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex-1 space-y-1.5">
              {state.channelSplit.map((c, i) => (
                <li key={c.channel} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {c.channel}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Trophy className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" /> Producto más vendido
          </p>
          <p className="text-xl font-bold text-white">{state.topProduct}</p>
          <p className="text-xs text-slate-500">Se mantiene como el más pedido hoy</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Pedidos recientes</p>
          <ul className="space-y-2">
            {state.orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between text-xs text-slate-300">
                <span>#{o.id} · {o.channel}</span>
                <span className="font-semibold text-white">{formatCurrencyARS(o.total)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" /> Alertas
          </p>
          {lowStock.length === 0 && delayedOrders.length === 0 && outOfStock.length === 0 ? (
            <p className="text-xs text-slate-500">Sin alertas por ahora.</p>
          ) : (
            <ul className="space-y-1.5">
              {lowStock.map((i) => (
                <li key={i.id} className="text-xs text-amber-400">Stock bajo: {i.name}</li>
              ))}
              {delayedOrders.map((o) => (
                <li key={o.id} className="text-xs text-red-400">Pedido demorado: #{o.id}</li>
              ))}
              {outOfStock.map((m) => (
                <li key={m.id} className="text-xs text-slate-400">Producto agotado: {m.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
