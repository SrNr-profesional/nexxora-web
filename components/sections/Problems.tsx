"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Check } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TiltCard from "@/components/ui/TiltCard";
import AuroraBackground from "@/components/ui/AuroraBackground";
import { useIndustry } from "@/components/industry/IndustryContext";
import { EASE_OUT, scrollToId } from "@/lib/motion";

export default function Problems() {
  const { industry } = useIndustry();
  const problems = industry.problems;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = activeIndex !== null ? problems[activeIndex] ?? null : null;

  // Al cambiar de rubro se cierra el detalle abierto.
  useEffect(() => setActiveIndex(null), [industry.id]);

  const toggle = (i: number) => {
    const next = activeIndex === i ? null : i;
    setActiveIndex(next);
    if (next === null) return;
    // En celular el detalle queda debajo de todas las tarjetas: lo traemos a la vista.
    window.setTimeout(() => {
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < 120 || rect.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: "smooth", block: rect.height > window.innerHeight * 0.7 ? "start" : "center" });
      }
    }, 380);
  };

  return (
    <section id="problemas" className="relative isolate py-24 sm:py-32">
      <AuroraBackground palette="blue" intensity={0.55} showGrid={false} />
      <Container>
        <SectionHeading
          key={`heading-${industry.id}`}
          eyebrow="Diagnóstico rápido"
          title={industry.problemsTitle}
          description="Seleccioná un problema para ver cómo Nexxora podría simplificarlo."
        />

        <div
          key={`grid-${industry.id}`}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {problems.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <TiltCard key={item.title} maxTilt={6} className="h-full min-h-[190px]">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: EASE_OUT }}
                  onClick={() => toggle(i)}
                  aria-expanded={isActive}
                  aria-controls="problem-detail"
                  className={`focus-ring group relative flex h-full min-h-[190px] w-full flex-col rounded-xl2 border p-5 text-left transition-colors duration-300 ${
                    isActive
                      ? "border-brand-blue/50 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 shadow-glow"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 ${
                      isActive ? "bg-brand-gradient" : "bg-white/[0.06] group-hover:bg-white/10"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-brand-cyan"}`} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-white">{item.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.consequence}</p>
                  <span
                    className={`mt-auto flex items-center gap-1 pt-4 text-xs font-semibold transition-colors ${
                      isActive ? "text-brand-cyan" : "text-slate-500 group-hover:text-white"
                    }`}
                  >
                    {isActive ? "Ocultar solución" : "Ver solución"}
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        isActive ? "rotate-90" : "group-hover:translate-x-0.5"
                      }`}
                    />
                  </span>
                </motion.button>
              </TiltCard>
            );
          })}
        </div>

        {/* Un solo contenedor anima el alto; el contenido hace crossfade al cambiar de problema. */}
        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              key="problem-detail"
              id="problem-detail"
              ref={panelRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card sm:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mb-6 text-center text-sm font-semibold text-white">{active.title}</p>
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Antes</p>
                        <ul className="space-y-2.5">
                          {active.before.map((line, i) => (
                            <motion.li
                              key={line}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
                              className="flex items-start gap-2 text-sm text-slate-400"
                            >
                              <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-400/70" />
                              {line}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-center py-2 sm:py-0">
                        <div className="flex h-10 w-10 rotate-90 items-center justify-center rounded-full bg-brand-gradient shadow-glow sm:rotate-0">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      <div className="rounded-xl2 border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 p-5">
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-cyan">Con Nexxora</p>
                        <ul className="space-y-2.5">
                          {active.after.map((line, i) => (
                            <motion.li
                              key={line}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                              className="flex items-start gap-2 text-sm text-slate-200"
                            >
                              <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                              {line}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mt-14 flex flex-col items-center justify-center gap-4 text-center"
        >
          <p className="text-base font-semibold text-white sm:text-lg">
            ¿Reconociste uno o más de estos problemas?
          </p>
          <Button onClick={() => scrollToId("soluciones")}>
            Ver cómo lo resolvemos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
