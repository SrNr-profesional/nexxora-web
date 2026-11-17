"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion, useSpring } from "framer-motion";
import { CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

export interface FlowNode {
  icon: LucideIcon;
  label: string;
  status: string;
}

const STEP_MS = 950;
const SYNCED_HOLD_MS = 1600;

/**
 * Tarjeta "Todo conectado en tiempo real" del hero. Recorre los nodos del
 * rubro activo uno por uno.
 *
 * Rendimiento: la inclinación 3D usa springs (no estado de React), la línea
 * de progreso anima solo `transform`, y el ciclo se detiene cuando la tarjeta
 * sale de pantalla o la pestaña queda en segundo plano.
 */
export default function ConnectedFlow({ nodes }: { nodes: FlowNode[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3 });

  const rotateX = useSpring(0, { stiffness: 120, damping: 16 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 16 });

  const count = nodes.length;

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveIndex(count);
      return;
    }
    if (paused || !inView) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const run = (i: number) => {
      if (cancelled) return;
      setActiveIndex(i);
      const done = i >= count;
      timeoutId = setTimeout(() => run(done ? 0 : i + 1), done ? SYNCED_HOLD_MS : STEP_MS);
    };

    const onVisibility = () => {
      clearTimeout(timeoutId);
      if (!document.hidden) run(0);
    };

    run(0);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // `nodes` reinicia el ciclo al cambiar de rubro.
  }, [paused, inView, prefersReducedMotion, count, nodes]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(py * -7);
    rotateY.set(px * 7);
  };

  const handleMouseLeave = () => {
    setPaused(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const synced = activeIndex >= count;
  const progress = synced ? 1 : count > 1 ? Math.min(activeIndex, count - 1) / (count - 1) : 1;

  return (
    <div
      ref={containerRef}
      // Solo con mouse: en pantallas táctiles un toque dejaba la animación pausada para siempre.
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative mx-auto mt-16 max-w-5xl [perspective:1400px] sm:mt-20"
    >
      {/* Desktop: tarjeta con inclinación 3D sutil */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative hidden rounded-2xl glass-strong p-8 shadow-card will-change-transform lg:block"
      >
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Todo conectado en tiempo real</p>
          <AnimatePresence mode="wait" initial={false}>
            {synced ? (
              <motion.span
                key="synced"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Operación sincronizada
              </motion.span>
            ) : (
              <motion.span
                key="live"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-xs text-slate-500"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan motion-safe:animate-pulse-glow" />
                Simulación en vivo
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div
          className="relative grid gap-4"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          <div
            className="absolute top-6 h-px bg-white/10"
            style={{ left: `${50 / count}%`, right: `${50 / count}%` }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple shadow-[0_0_10px_rgba(34,211,238,0.6)]"
              initial={false}
              animate={{ scaleX: progress }}
              transition={{ duration: activeIndex === 0 ? 0.25 : 0.7, ease: EASE_OUT }}
            />
          </div>

          {nodes.map((node, i) => {
            const isLit = synced || activeIndex >= i;
            const isCurrent = !synced && activeIndex === i;
            return (
              <div key={node.label} className="relative flex flex-col items-center gap-3 text-center">
                <div className="relative z-10 h-12 w-12">
                  {/* Dos capas con opacity en vez de transicionar el background: no fuerza repaint */}
                  <span className="absolute inset-0 rounded-xl border border-white/10 bg-base-900" />
                  <span
                    className={cn(
                      "absolute inset-0 rounded-xl bg-brand-gradient shadow-glow transition-opacity duration-500",
                      isLit ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {isCurrent && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0.6, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.7 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="absolute inset-0 rounded-xl border border-brand-cyan"
                    />
                  )}
                  <node.icon
                    className={cn(
                      "absolute inset-0 m-auto h-5 w-5 transition-colors duration-500",
                      isLit ? "text-white" : "text-slate-500"
                    )}
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

      {/* Mobile / tablet: lista vertical, sin tilt */}
      <div className="rounded-2xl glass-strong p-6 lg:hidden">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Todo conectado en tiempo real</p>
          <span
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 transition-opacity duration-300",
              synced ? "opacity-100" : "opacity-0"
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Sincronizado
          </span>
        </div>
        <div className="relative space-y-3">
          <div className="absolute bottom-4 left-[17px] top-4 w-px bg-white/10" aria-hidden="true">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-brand-cyan via-brand-blue to-brand-purple"
              initial={false}
              animate={{ scaleY: progress }}
              transition={{ duration: activeIndex === 0 ? 0.25 : 0.7, ease: EASE_OUT }}
            />
          </div>
          {nodes.map((node, i) => {
            const isLit = synced || activeIndex >= i;
            return (
              <div key={node.label} className="relative flex items-center gap-3">
                <div className="relative h-9 w-9 flex-shrink-0">
                  <span className="absolute inset-0 rounded-lg border border-white/10 bg-base-900" />
                  <span
                    className={cn(
                      "absolute inset-0 rounded-lg bg-brand-gradient transition-opacity duration-500",
                      isLit ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <node.icon
                    className={cn(
                      "absolute inset-0 m-auto h-4 w-4 transition-colors duration-500",
                      isLit ? "text-white" : "text-slate-500"
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-xs font-semibold transition-colors duration-500", isLit ? "text-white" : "text-slate-500")}>
                    {node.label}
                  </p>
                  <p className={cn("truncate text-[11px] transition-colors duration-500", isLit ? "text-brand-cyan" : "text-slate-600")}>
                    {node.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
