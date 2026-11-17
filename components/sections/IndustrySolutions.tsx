"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Cctv, Layers, MessageCircle, SlidersHorizontal, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import { useIndustry } from "@/components/industry/IndustryContext";
import { TIER_META, type ServiceTier } from "@/lib/industries";
import { EASE_OUT, SPRING_PILL, openExternal, scrollToId } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Filter = "todos" | ServiceTier;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "base", label: TIER_META.base.label },
  { id: "ia", label: TIER_META.ia.label },
  { id: "vision", label: TIER_META.vision.label },
];

const TIER_STYLES: Record<ServiceTier, { badge: string; icon: string }> = {
  base: { badge: "border-white/10 bg-white/[0.04] text-slate-300", icon: "bg-white/[0.06] text-brand-cyan" },
  ia: { badge: "border-brand-blue/30 bg-brand-blue/10 text-blue-200", icon: "bg-brand-blue/15 text-blue-300" },
  vision: { badge: "border-brand-purple/40 bg-brand-purple/15 text-violet-200", icon: "bg-brand-gradient text-white shadow-glow" },
};

/**
 * Catálogo de soluciones del rubro activo (todos menos Gastronomía, que tiene
 * su demo interactiva propia). Se puede filtrar por nivel de servicio.
 */
export default function IndustrySolutions() {
  const { industry, whatsappLink } = useIndustry();
  const [filter, setFilter] = useState<Filter>("todos");

  useEffect(() => setFilter("todos"), [industry.id]);

  const services = industry.services.filter((s) => filter === "todos" || s.tier === filter);
  const visionCount = industry.services.filter((s) => s.tier === "vision").length;

  const highlights = [
    { icon: Layers, label: `${industry.services.length} soluciones para tu rubro` },
    { icon: Zap, label: "Todo comparte la misma información" },
    { icon: SlidersHorizontal, label: "Contratás solo lo que necesitás" },
  ];

  return (
    <section id="soluciones" className="relative isolate py-24 sm:py-32">
      <AuroraBackground palette="purple" intensity={0.7} />
      <Container>
        <SectionHeading
          key={industry.id}
          eyebrow={industry.label}
          title={industry.solutionsTitle}
          description={industry.solutionsText}
        />

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-2 text-sm text-slate-400">
              <h.icon className="h-4 w-4 shrink-0 text-brand-cyan" />
              {h.label}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Filtrar soluciones por nivel"
            className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1"
          >
            {FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "focus-ring relative flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                    isActive ? "text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="solutions-filter-pill"
                      aria-hidden="true"
                      transition={SPRING_PILL}
                      className="absolute inset-0 rounded-full bg-brand-gradient shadow-glow"
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={`${industry.id}-${filter}`}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => {
              const styles = TIER_STYLES[service.tier];
              const isVision = service.tier === "vision";
              return (
                <motion.li
                  key={service.title}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
                  }}
                  className={cn(
                    "group relative flex h-full flex-col rounded-xl2 border p-5 transition-[border-color,transform] duration-300 hover:-translate-y-1",
                    isVision
                      ? "border-brand-purple/30 bg-gradient-to-br from-brand-purple/[0.12] via-white/[0.02] to-brand-cyan/[0.06] hover:border-brand-purple/60"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  )}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl", styles.icon)}>
                      <service.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", styles.badge)}>
                      {isVision ? "Visión IA" : service.tier === "ia" ? "IA" : "Base"}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-white">{service.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{service.text}</p>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>

        {visionCount > 0 && filter !== "vision" && (
          <button
            type="button"
            onClick={() => scrollToId("vision-ia")}
            className="focus-ring mx-auto mt-8 flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-4 py-2 text-sm font-semibold text-violet-200 transition-colors hover:bg-brand-purple/20"
          >
            <Cctv className="h-4 w-4" />
            Ver las {visionCount} soluciones con cámaras en acción
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-brand-blue/10 via-base-900 to-brand-purple/10 p-8 text-center shadow-card sm:p-10"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <h3 className="text-balance text-xl font-bold text-white sm:text-2xl">
            ¿Tu operación necesita algo que no está en la lista?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
            {capitalize(industry.each)} funciona distinto. Contanos tu caso y diseñamos la solución a medida.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticWrapper strength={0.25}>
              <Button onClick={() => scrollToId("diagnostico")}>
                Quiero mi diagnóstico gratuito
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.25}>
              <Button variant="secondary" onClick={() => openExternal(whatsappLink)}>
                <MessageCircle className="h-4 w-4" />
                Hablar por WhatsApp
              </Button>
            </MagneticWrapper>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
