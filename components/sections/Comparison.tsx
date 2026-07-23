"use client";

import { motion } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

const BEFORE = [
  "Pedidos por varios canales",
  "Información escrita manualmente",
  "Stock estimado",
  "Precios difíciles de actualizar",
  "Datos separados",
  "El dueño depende de estar presente",
];

const AFTER = [
  "Pedidos centralizados",
  "Información directa a cocina",
  "Stock actualizado",
  "Menú editable",
  "Ventas y estadísticas en un panel",
  "Acceso desde dispositivos autorizados",
];

export default function Comparison() {
  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Antes y después"
          title="De una operación fragmentada a un sistema conectado"
        />

        <div className="relative mt-14 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <TiltCard maxTilt={5}>
            <motion.div
              initial={{ opacity: 0, x: -20, rotate: -1 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-xl2 border border-white/10 bg-white/[0.02] p-6 shadow-card sm:p-8"
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-500">
                Operación tradicional
              </p>
              <ul className="space-y-3">
                {BEFORE.map((line, i) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm text-slate-400"
                  >
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400/70" />
                    {line}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </TiltCard>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto flex h-12 w-12 rotate-90 items-center justify-center rounded-full bg-brand-gradient shadow-glow lg:rotate-0"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </motion.div>

          <TiltCard maxTilt={5}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="h-full rounded-xl2 border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 p-6 shadow-glow sm:p-8"
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-brand-cyan">Con Nexxora</p>
              <ul className="space-y-3">
                {AFTER.map((line, i) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm text-slate-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    {line}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </TiltCard>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 max-w-xl text-center text-xs text-slate-500 sm:text-sm"
        >
          El nivel de automatización depende de los procesos y necesidades de cada restaurante.
        </motion.p>
      </Container>
    </section>
  );
}
