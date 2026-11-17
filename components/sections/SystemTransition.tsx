"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { useIndustry } from "@/components/industry/IndustryContext";
import { EASE_OUT } from "@/lib/motion";

/**
 * Transición breve entre "Problemas" y "Soluciones": muestra los eslabones de
 * la operación del rubro activo y una línea que se completa con el scroll.
 */
export default function SystemTransition() {
  const { industry } = useIndustry();
  const chainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: chainRef, offset: ["start 0.9", "end 0.55"] });
  // El spring suaviza el avance cuando el scroll es a saltos (rueda del mouse).
  const lineScale = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <section className="relative py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="text-balance text-xl font-bold text-white sm:text-2xl"
          >
            Los problemas no se resuelven con herramientas aisladas.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
            className="mt-2.5 text-sm text-slate-400 sm:text-base"
          >
            Por eso Nexxora conecta cada parte de la operación dentro de un mismo sistema.
          </motion.p>
        </div>

        <div ref={chainRef} className="relative mx-auto mt-9 max-w-3xl">
          <div
            className="absolute left-[6%] right-[6%] top-1/2 hidden h-px -translate-y-1/2 bg-white/10 sm:block"
            aria-hidden="true"
          >
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple"
              style={{ scaleX: lineScale }}
            />
          </div>

          <motion.div
            key={industry.id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-3"
          >
            {industry.chain.map((node, i) => (
              <Fragment key={node}>
                <motion.span
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
                  }}
                  className="rounded-full border border-white/10 bg-base-900 px-4 py-2 text-xs font-semibold text-slate-300 sm:text-sm"
                >
                  {node}
                </motion.span>
                {i < industry.chain.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-brand-cyan/60" aria-hidden="true" />
                )}
              </Fragment>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-8 flex justify-center"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-slate-600" aria-hidden="true" />
        </motion.div>
      </Container>
    </section>
  );
}
