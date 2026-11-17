"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import ConnectedFlow from "@/components/sections/ConnectedFlow";
import { useIndustry } from "@/components/industry/IndustryContext";
import { EASE_OUT, scrollToId } from "@/lib/motion";

export default function Hero() {
  const { industry } = useIndustry();
  const { hero } = industry;

  return (
    <section id="inicio" className="relative isolate overflow-hidden pb-24 pt-16 sm:pt-24">
      <AuroraBackground palette="cyan" showNet intensity={1.1} />

      <Container>
        {/* key = rubro: al cambiar de rubro el bloque entra de nuevo con una transición corta */}
        <motion.div
          key={industry.id}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.span
            variants={ITEM}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-cyan"
          >
            <industry.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            variants={ITEM}
            className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {hero.title} <span className="text-gradient">{hero.highlight}</span>
          </motion.h1>

          <motion.p
            variants={ITEM}
            className="text-pretty mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
          >
            {hero.text}
          </motion.p>

          <motion.div
            variants={ITEM}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticWrapper strength={0.3}>
              <Button size="lg" onClick={() => scrollToId("diagnostico")}>
                Solicitar diagnóstico gratuito
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.3}>
              <Button size="lg" variant="secondary" onClick={() => scrollToId("soluciones")}>
                <PlayCircle className="h-4 w-4" />
                Ver cómo funciona
              </Button>
            </MagneticWrapper>
          </motion.div>

          <motion.p variants={ITEM} className="mt-5 text-xs font-medium text-slate-500 sm:text-sm">
            Diagnóstico inicial sin compromiso · Sistema personalizado · Acompañamiento durante la
            implementación
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
        >
          <ConnectedFlow nodes={industry.flow} />
        </motion.div>
      </Container>
    </section>
  );
}

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};
