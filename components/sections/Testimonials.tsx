"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials() {
  return (
    <section className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Casos de uso" title="¿Qué podríamos analizar en tu restaurante?" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-2xl rounded-xl2 glass p-10 text-center"
        >
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-brand-cyan" />
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
