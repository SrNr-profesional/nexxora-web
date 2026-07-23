"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Gauge,
  PackageCheck,
  LineChart,
  ClipboardCheck,
  Tag,
  Smile,
  ListChecks,
  Smartphone,
  SlidersHorizontal,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

const BENEFITS = [
  { icon: CheckCircle2, text: "Menos errores en los pedidos." },
  { icon: Gauge, text: "Mayor rapidez entre caja y cocina." },
  { icon: PackageCheck, text: "Más control sobre el stock." },
  { icon: LineChart, text: "Información para tomar mejores decisiones." },
  { icon: ClipboardCheck, text: "Menos tareas administrativas manuales." },
  { icon: Tag, text: "Mayor facilidad para actualizar precios." },
  { icon: Smile, text: "Mejor experiencia para el cliente." },
  { icon: ListChecks, text: "Operación más ordenada." },
  { icon: Smartphone, text: "Acceso a información del negocio desde el celular." },
  { icon: SlidersHorizontal, text: "Sistema adaptado al tamaño y funcionamiento del restaurante." },
];

export default function Benefits() {
  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Beneficios" title="Resultados que podés conseguir" />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <TiltCard key={b.text} maxTilt={5} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                className="group flex h-full items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-brand-blue/30 hover:bg-white/[0.05]"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-gradient/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]">
                  <b.icon className="h-4 w-4 text-brand-cyan" />
                </div>
                <p className="text-sm font-medium text-slate-200">{b.text}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-500">
          Los resultados pueden variar según la operación y el nivel de implementación de cada restaurante.
        </p>
      </Container>
    </section>
  );
}
