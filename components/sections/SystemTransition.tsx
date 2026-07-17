"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";

const CHAIN = ["Pedidos", "Cocina", "Stock", "Ventas", "Clientes"];

/**
 * Sección breve de transición, ubicada como hermana inmediatamente ANTES de
 * <RestaurantSolutionsSection />. No envuelve ni modifica esa sección: es un
 * <section> independiente en el flujo normal de la página.
 */
export default function SystemTransition() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold text-white sm:text-2xl"
          >
            Los problemas no se resuelven con herramientas aisladas.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-2.5 text-sm text-slate-400 sm:text-base"
          >
            Por eso Nexxora conecta cada parte de la operación dentro de un mismo sistema.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-9 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-3"
        >
          {CHAIN.map((node, i) => (
            <div key={node} className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 sm:text-sm">
                {node}
              </span>
              {i < CHAIN.length - 1 && <span className="text-brand-cyan/60">→</span>}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center"
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-slate-600" aria-hidden="true" />
        </motion.div>
      </Container>
    </section>
  );
}
