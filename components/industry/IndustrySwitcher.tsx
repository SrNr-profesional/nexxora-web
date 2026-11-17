"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { INDUSTRIES } from "@/lib/industries";
import { SPRING_PILL } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useIndustry } from "./IndustryContext";

/**
 * Barra de rubros. Queda fija debajo del header mientras se recorren las
 * secciones que dependen del rubro, para poder pasar de Gastronomía a
 * Logística (o cualquier otro) sin volver al inicio.
 */
export default function IndustrySwitcher() {
  const { industry, setIndustry } = useIndustry();
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Mantiene a la vista la pestaña activa sin mover el scroll de la página.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const tab = scroller?.querySelector<HTMLElement>(`[data-industry="${industry.id}"]`);
    if (!scroller || !tab) return;
    const target = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [industry.id]);

  return (
    <div className="sticky top-14 z-40 border-b border-white/10 bg-base-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-5 sm:px-8 lg:px-10">
        <span className="hidden flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-500 md:block">
          Tu rubro
        </span>
        <div
          ref={scrollerRef}
          role="tablist"
          aria-label="Elegí tu rubro"
          className="no-scrollbar edge-fade-x relative flex flex-1 gap-1 overflow-x-auto py-2"
        >
          {INDUSTRIES.map((item) => {
            const isActive = item.id === industry.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                data-industry={item.id}
                aria-selected={isActive}
                onClick={() => setIndustry(item.id)}
                className={cn(
                  "focus-ring relative flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-200",
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="industry-pill"
                    aria-hidden="true"
                    transition={SPRING_PILL}
                    className="absolute inset-0 rounded-full bg-brand-gradient shadow-glow"
                  />
                )}
                <item.icon className="relative h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
