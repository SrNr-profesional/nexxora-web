"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AuroraBackground from "@/components/ui/AuroraBackground";

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 sm:py-28">
      <AuroraBackground palette="purple" intensity={0.5} showGrid={false} />
      <Container>
        <SectionHeading eyebrow="Casos de uso" title="¿Qué podríamos analizar en tu restaurante?" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-xl2 glass-strong p-10 text-center shadow-card"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <motion.div
            animate={prefersReducedMotion ? undefined : { opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow"
          >
            <Sparkles className="h-7 w-7 text-white" />
          </motion.div>
          <p className="text-lg font-medium text-slate-300">
            Próximamente: casos de implementación y resultados de nuestros clientes.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Mientras tanto, contanos cómo funciona tu restaurante y te mostramos qué partes de tu operación
            podrían automatizarse.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
