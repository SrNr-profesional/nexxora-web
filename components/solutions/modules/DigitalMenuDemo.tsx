"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, CheckCircle2, Loader2 } from "lucide-react";
import { useDemo } from "../DemoContext";
import PhoneMockup from "../PhoneMockup";
import AnimatedConnection from "../AnimatedConnection";
import { formatCurrencyARS } from "@/lib/utils";
import { cn } from "@/lib/utils";

function QrPattern() {
  const size = 7;
  const cells = Array.from({ length: size * size }, (_, i) => {
    const row = Math.floor(i / size);
    const col = i % size;
    const isFinder =
      (row < 2 && col < 2) || (row < 2 && col > size - 3) || (row > size - 3 && col < 2);
    const filled = isFinder || (row * 3 + col * 7) % 5 < 2;
    return filled;
  });
  return (
    <div className="relative grid grid-cols-7 gap-[3px] rounded-lg bg-white p-3">
      {cells.map((filled, i) => (
        <div key={i} className={cn("h-2 w-2 rounded-[1px]", filled ? "bg-base-950" : "bg-transparent")} />
      ))}
      <div className="pointer-events-none absolute inset-3 overflow-hidden rounded-lg motion-reduce:hidden">
        <div className="h-1/12 w-full animate-scan bg-gradient-to-r from-transparent via-brand-cyan/80 to-transparent" style={{ height: "8%" }} />
      </div>
    </div>
  );
}

export default function DigitalMenuDemo() {
  const { state, updatePrice, toggleAvailability } = useDemo();
  const target = state.menu[1] ?? state.menu[0];
  const [draftPrice, setDraftPrice] = useState(String(target.price));
  const [updating, setUpdating] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  const handleUpdate = () => {
    const price = Number(draftPrice.replace(/\D/g, ""));
    if (!price || price === target.price) return;
    setUpdating(true);
    window.setTimeout(() => {
      updatePrice(target.id, price);
      setUpdating(false);
      setJustUpdated(true);
      window.setTimeout(() => setJustUpdated(false), 2600);
    }, 700);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 text-center">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          <QrCode className="h-3.5 w-3.5" aria-hidden="true" /> Soporte de mesa
        </div>
        <QrPattern />
        <p className="text-sm font-semibold text-white">Escaneá para ver el menú</p>
        <p className="text-xs text-slate-500">{state.name}</p>
      </div>

      <AnimatedConnection active={false} orientation="horizontal" className="hidden lg:flex lg:h-px lg:w-10" />

      <PhoneMockup height={440}>
        <div className="flex h-full flex-col bg-base-950">
          <div className="border-b border-white/10 bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 px-3.5 py-3">
            <p className="text-[11px] text-slate-400">{state.name}</p>
            <p className="text-sm font-bold text-white">Menú digital</p>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
            {state.menu.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors",
                  item.id === target.id && "border-brand-blue/40"
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{item.name}</p>
                  <p className={cn("text-xs font-bold", item.available ? "text-brand-cyan" : "text-slate-600 line-through")}>
                    {formatCurrencyARS(item.price)}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    item.available ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                  )}
                >
                  {item.available ? "Disponible" : "Agotado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PhoneMockup>

      <AnimatedConnection active={updating} orientation="horizontal" label={justUpdated ? "Actualizado" : undefined} className="hidden lg:flex lg:h-px lg:w-10" />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Panel administrativo</p>
        <p className="text-sm font-semibold text-white">{target.name}</p>
        <p className="mb-4 text-xs text-slate-500">Precio actual: {formatCurrencyARS(target.price)}</p>

        <label htmlFor="menu-price-input" className="mb-1.5 block text-xs font-medium text-slate-400">
          Nuevo precio
        </label>
        <input
          id="menu-price-input"
          type="text"
          inputMode="numeric"
          value={draftPrice}
          onChange={(e) => setDraftPrice(e.target.value)}
          className="focus-ring mb-3 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
        />
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gradient py-2.5 text-sm font-bold text-white shadow-glow disabled:opacity-60"
        >
          {updating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {updating ? "Actualizando..." : "Actualizar precio"}
        </button>

        {justUpdated && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Actualizado en tiempo real
          </motion.div>
        )}
        <p className="mt-2 text-[11px] text-slate-500">Sin reimprimir cartas ni códigos QR.</p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs font-medium text-slate-400">Estado del producto</span>
          <button
            role="switch"
            aria-checked={target.available}
            aria-label={`Marcar ${target.name} como ${target.available ? "agotado" : "disponible"}`}
            onClick={() => toggleAvailability(target.id)}
            className={cn(
              "focus-ring relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors",
              target.available ? "bg-emerald-500" : "bg-red-500/70"
            )}
          >
            <span
              className={cn(
                "h-5 w-5 rounded-full bg-white transition-transform",
                target.available ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
