"use client";

import { motion } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import { useIndustry } from "@/components/industry/IndustryContext";
import { EASE_OUT } from "@/lib/motion";

const LIST = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const ITEM_LEFT = { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } } };
const ITEM_RIGHT = { hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } } };

export default function Comparison() {
  const { industry } = useIndustry();
  const { before, after } = industry.comparison;

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Antes y después"
          title="De una operación fragmentada a un sistema conectado"
        />

        {/* key = rubro: las listas vuelven a entrar al cambiar de rubro */}
        <div key={industry.id} className="relative mt-14 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <TiltCard maxTilt={5} className="h-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="h-full rounded-xl2 border border-white/10 bg-white/[0.02] p-6 shadow-card sm:p-8"
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-500">
                Operación tradicional
              </p>
              <motion.ul
                variants={LIST}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-3"
              >
                {before.map((line) => (
                  <motion.li key={line} variants={ITEM_LEFT} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400/70" />
                    {line}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </TiltCard>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
            className="mx-auto flex h-12 w-12 rotate-90 items-center justify-center self-center rounded-full bg-brand-gradient shadow-glow lg:rotate-0"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </motion.div>

          <TiltCard maxTilt={5} className="h-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
              className="h-full rounded-xl2 border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 p-6 shadow-glow sm:p-8"
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-brand-cyan">Con Nexxora</p>
              <motion.ul
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.45 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-3"
              >
                {after.map((line) => (
                  <motion.li key={line} variants={ITEM_RIGHT} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    {line}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </TiltCard>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-slate-500 sm:text-sm">
          El nivel de automatización depende de los procesos y necesidades de {industry.each}.
        </p>
      </Container>
    </section>
  );
}
