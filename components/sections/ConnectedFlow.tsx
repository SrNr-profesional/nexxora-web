"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Smartphone, ClipboardCheck, ChefHat, Package, BarChart3, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NODES = [
  { icon: Smartphone, label: "Cliente", status: "Pedido #128 enviado" },
  { icon: ClipboardCheck, label: "Pedido", status: "Confirmado" },
  { icon: ChefHat, label: "Cocina", status: "En preparación" },
  { icon: Package, label: "Stock", status: "-1 pan · -2 medallones" },
  { icon: BarChart3, label: "Administración", status: "Venta registrada" },
];

const STEP_MS = 950;
const SYNCED_HOLD_MS = 1600;

/**
 * Tarjeta horizontal "Todo conectado en tiempo real" que reemplaza los cuatro
 * cuadros del hero. Componente nuevo e independiente: no reutiliza nada de la
 * demostración protegida en components/solutions.
 */
export default function ConnectedFlow() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveIndex(NODES.length);
      return;
    }
    if (paused || !inView) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const run = (i: number) => {
      if (cancelled) return;
      setActiveIndex(i);
      const delay = i >= NODES.length ? SYNCED_HOLD_MS : STEP_MS;
      timeoutId = setTimeout(() => run(i >= NODES.length ? 0 : i + 1), delay);
    };

    run(0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [paused, inView, prefersReducedMotion]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: Math.max(-5, Math.min(5, py * -8)), y: Math.max(-5, Math.min(5, px * 8)) });
  };

  const synced = activeIndex >= NODES.length;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setTilt({ x: 0, y: 0 });
      }}
      className="relative mx-auto mt-20 max-w-5xl"
    >
      {/* Desktop: card with subtle 3D tilt */}
      <motion.div
        onMouseMove={handleMouseMove}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative hidden rounded-2xl glass-strong p-8 shadow-card [perspective:1400px] lg:block"
      >
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Todo conectado en tiempo real</p>
          <AnimatePresence mode="wait">
            {synced ? (
              <motion.span
                key="synced"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Operación sincronizada
              </motion.span>
            ) : (
              <span className="text-xs text-slate-500">Simulación en vivo</span>
            )}
          </AnimatePresence>
        </div>

        <div className="relative grid grid-cols-5 gap-4">
          <div className="absolute left-[10%] right-[10%] top-6 h-px overflow-hidden bg-white/10" aria-hidden="true">
            {!prefersReducedMotion && (
              <span className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand-cyan shadow-[0_0_10px_2px_rgba(34,211,238,0.7)] animate-dot-move" />
            )}
          </div>
          {NODES.map((node, i) => {
            const isLit = synced || activeIndex >= i;
            return (
              <div key={node.label} className="relative flex flex-col items-center gap-3 text-center">
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-500",
                    isLit ? "border-transparent bg-brand-gradient shadow-glow" : "border-white/10 bg-white/[0.03]"
                  )}
                >
                  <node.icon
                    className={cn("h-5 w-5 transition-colors duration-500", isLit ? "text-white" : "text-slate-500")}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold transition-colors duration-500",
                      isLit ? "text-white" : "text-slate-500"
                    )}
                  >
                    {node.label}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[11px] transition-colors duration-500",
                      isLit ? "text-brand-cyan" : "text-slate-600"
                    )}
                  >
                    {node.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Mobile / tablet: vertical list, sin tilt */}
      <div className="rounded-2xl glass-strong p-6 lg:hidden">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Todo conectado en tiempo real</p>
          {synced && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Sincronizado
            </span>
          )}
        </div>
        <div className="space-y-3">
          {NODES.map((node, i) => {
            const isLit = synced || activeIndex >= i;
            return (
              <div key={node.label} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border transition-colors duration-500",
                    isLit ? "border-transparent bg-brand-gradient" : "border-white/10 bg-white/[0.03]"
                  )}
                >
                  <node.icon className={cn("h-4 w-4", isLit ? "text-white" : "text-slate-500")} />
                </div>
                <div className="flex-1">
                  <p className={cn("text-xs font-semibold", isLit ? "text-white" : "text-slate-500")}>
                    {node.label}
                  </p>
                  <p className={cn("text-[11px]", isLit ? "text-brand-cyan" : "text-slate-600")}>{node.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
