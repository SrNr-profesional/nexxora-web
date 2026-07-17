"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Loader2, CheckCircle2, ChefHat } from "lucide-react";
import { useDemo } from "../DemoContext";
import PhoneMockup from "../PhoneMockup";
import AnimatedConnection from "../AnimatedConnection";
import { formatCurrencyARS, cn } from "@/lib/utils";
import { DemoOrder } from "@/lib/restaurantDemoData";

interface CartLine {
  itemId: string;
  name: string;
  price: number;
  qty: number;
  extras: string[];
}

const DELIVERY_OPTIONS: DemoOrder["deliveryType"][] = ["Retiro", "Salón", "Delivery"];
const PAYMENT_OPTIONS = ["Efectivo", "Transferencia", "Pago online"];

export default function OnlineOrderDemo() {
  const { state, placeOrder } = useDemo();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [activeExtras, setActiveExtras] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<DemoOrder["deliveryType"]>("Retiro");
  const [payment, setPayment] = useState(PAYMENT_OPTIONS[0]);
  const [step, setStep] = useState<"carrito" | "procesando" | "confirmado">("carrito");
  const [confirmedId, setConfirmedId] = useState<number | null>(null);

  const total = cart.reduce((a, l) => a + l.price * l.qty, 0);
  const nextId = state.lastOrderId + 1;

  const availableItems = useMemo(() => state.menu.filter((m) => m.available), [state.menu]);

  const addItem = (itemId: string) => {
    const item = state.menu.find((m) => m.id === itemId);
    if (!item) return;
    setCart((prev) => {
      const existing = prev.find((l) => l.itemId === itemId);
      if (existing) return prev.map((l) => (l.itemId === itemId ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { itemId, name: item.name, price: item.price, qty: 1, extras: [] }];
    });
  };

  const changeQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((l) => (l.itemId === itemId ? { ...l, qty: Math.max(0, l.qty + delta) } : l)).filter((l) => l.qty > 0)
    );
  };

  const confirmOrder = () => {
    if (cart.length === 0) return;
    setStep("procesando");
    window.setTimeout(() => {
      const idBefore = nextId;
      placeOrder({
        items: cart.map((l) => ({ itemId: l.itemId, name: l.name, qty: l.qty, price: l.price, extras: l.extras })),
        deliveryType: delivery,
        paymentMethod: payment,
        channel: "App",
      });
      setConfirmedId(idBefore);
      setStep("confirmado");
      setCart([]);
    }, 1100);
  };

  const reset = () => {
    setStep("carrito");
    setConfirmedId(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
      <PhoneMockup height={480}>
        <div className="flex h-full flex-col bg-base-950">
          <div className="border-b border-white/10 bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 px-3.5 py-3">
            <p className="text-[11px] text-slate-400">{state.name}</p>
            <p className="text-sm font-bold text-white">Pedidos online</p>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto p-3 pb-2">
            {availableItems.map((item) => {
              const line = cart.find((l) => l.itemId === item.id);
              return (
                <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{item.name}</p>
                      <p className="text-xs font-bold text-brand-cyan">{formatCurrencyARS(item.price)}</p>
                    </div>
                    {line ? (
                      <div className="flex flex-shrink-0 items-center gap-1.5">
                        <button
                          onClick={() => changeQty(item.id, -1)}
                          aria-label={`Quitar ${item.name}`}
                          className="focus-ring rounded-full bg-white/10 p-1"
                        >
                          <Minus className="h-3 w-3 text-white" aria-hidden="true" />
                        </button>
                        <span className="w-4 text-center text-xs text-white">{line.qty}</span>
                        <button
                          onClick={() => changeQty(item.id, 1)}
                          aria-label={`Agregar otro ${item.name}`}
                          className="focus-ring rounded-full bg-white/10 p-1"
                        >
                          <Plus className="h-3 w-3 text-white" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addItem(item.id)}
                        aria-label={`Agregar ${item.name}`}
                        className="focus-ring flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {state.extras.length > 0 && cart.length > 0 && (
              <div className="rounded-lg border border-dashed border-white/10 p-2.5">
                <p className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-500">Extras sugeridos</p>
                <div className="flex flex-wrap gap-1.5">
                  {state.extras.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setActiveExtras((prev) => (prev.includes(ex) ? prev.filter((e) => e !== ex) : [...prev, ex]))}
                      className={cn(
                        "focus-ring rounded-full border px-2 py-1 text-[10px] font-medium",
                        activeExtras.includes(ex) ? "border-brand-blue bg-brand-blue/20 text-white" : "border-white/15 text-slate-400"
                      )}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-white/10 px-3.5 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total</span>
              <span className="font-bold text-white">{formatCurrencyARS(total)}</span>
            </div>
          </div>
        </div>
      </PhoneMockup>

      <AnimatedConnection
        active={step === "confirmado"}
        orientation="horizontal"
        label={step === "confirmado" ? "Pedido enviado a cocina" : undefined}
        className="hidden lg:flex lg:h-px lg:w-10 lg:self-center"
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="mb-4 text-sm font-bold text-white">Recorrido del pedido</p>

        <AnimatePresence mode="wait">
          {step === "carrito" && (
            <motion.div key="carrito" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-medium text-slate-400">Método de entrega</p>
                <div className="flex flex-wrap gap-2">
                  {DELIVERY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDelivery(d)}
                      className={cn(
                        "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium",
                        delivery === d ? "border-transparent bg-brand-gradient text-white" : "border-white/10 text-slate-400"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-slate-400">Método de pago</p>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPayment(p)}
                      className={cn(
                        "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium",
                        payment === p ? "border-transparent bg-brand-gradient text-white" : "border-white/10 text-slate-400"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
                Próximo número de pedido: <span className="font-bold text-white">#{nextId}</span>
              </div>
              <button
                onClick={confirmOrder}
                disabled={cart.length === 0}
                className="focus-ring w-full rounded-xl bg-brand-gradient py-3 text-sm font-bold text-white shadow-glow disabled:opacity-40"
              >
                Confirmar pedido
              </button>
            </motion.div>
          )}

          {step === "procesando" && (
            <motion.div key="procesando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-cyan" aria-hidden="true" />
              <p className="text-sm text-slate-400">Procesando pedido...</p>
            </motion.div>
          )}

          {step === "confirmado" && (
            <motion.div key="confirmado" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" aria-hidden="true" />
              <p className="text-lg font-bold text-white">Pedido confirmado</p>
              <p className="text-sm text-slate-400">Pedido #{confirmedId}</p>
              <p className="text-xs text-slate-500">Tiempo estimado: 15-20 minutos</p>
              <div className="mt-2 flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1.5 text-xs font-medium text-brand-cyan">
                <ChefHat className="h-3.5 w-3.5" aria-hidden="true" /> Enviado a cocina
              </div>
              <button onClick={reset} className="focus-ring mt-4 text-xs font-medium text-slate-500 underline">
                Simular otro pedido
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
