"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Gauge,
  PackageCheck,
  LineChart,
  ClipboardCheck,
  Smile,
  ListChecks,
  Smartphone,
  SlidersHorizontal,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import { useIndustry } from "@/components/industry/IndustryContext";
import { EASE_OUT } from "@/lib/motion";

const ICONS = [CheckCircle2, Gauge, PackageCheck, LineChart, Smile, Smartphone];

/** Beneficios que valen para cualquier rubro; se suman a los propios de cada uno. */
const COMMON = [
  { icon: ClipboardCheck, text: "Menos tareas administrativas manuales." },
  { icon: ListChecks, text: "Una operación más ordenada y medible." },
  { icon: SlidersHorizontal, text: "Un sistema adaptado a cómo trabaja tu equipo." },
];

export default function Benefits() {
  const { industry } = useIndustry();
  const benefits = [
    ...industry.benefits.map((text, i) => ({ icon: ICONS[i % ICONS.length], text })),
    ...COMMON,
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Beneficios" title="Resultados que podés conseguir" />

        <div key={industry.id} className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <TiltCard key={b.text} maxTilt={5} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: EASE_OUT }}
                className="group flex h-full items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-brand-blue/30 hover:bg-white/[0.05]"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-blue/15 transition-colors duration-300 group-hover:bg-brand-cyan/20">
                  <b.icon className="h-4 w-4 text-brand-cyan" />
                </div>
                <p className="text-sm font-medium text-slate-200">{b.text}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-500">
          Los resultados pueden variar según la operación y el nivel de implementación de {industry.each}.
        </p>
      </Container>
    </section>
  );
}
