"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Tablet, ChefHat, GraduationCap, Headset } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const CHECKLIST_ITEMS = ["Pedidos", "Cocina", "Stock", "Caja"];
const MODULES = ["Menú", "Cocina", "Stock", "Panel"];

function ChecklistVisual() {
  return (
    <div className="mt-4 space-y-2">
      {CHECKLIST_ITEMS.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}
          className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
        >
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-cyan" />
          <span className="text-xs font-medium text-slate-300">{item}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ModulesVisual() {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {MODULES.map((m, i) => (
          <motion.span
            key={m}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
            className="rounded-full bg-brand-gradient px-3.5 py-1.5 text-xs font-semibold text-white shadow-glow"
          >
            {m}
          </motion.span>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">Sin pagar por herramientas que no necesitás.</p>
    </div>
  );
}

function ProgressVisual() {
  return (
    <div className="mt-4">
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "82%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
          className="h-full rounded-full bg-brand-gradient"
        />
      </div>
      <p className="mt-2.5 text-xs text-slate-500">Productos, flujos, permisos y reportes configurados.</p>
    </div>
  );
}

function LaunchVisual() {
  const icons = [Tablet, ChefHat, GraduationCap, Headset];
  return (
    <div className="mt-4 flex gap-2.5">
      {icons.map((Icon, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"
        >
          <Icon className="h-4 w-4 text-brand-cyan" />
        </motion.div>
      ))}
    </div>
  );
}

const STEPS = [
  {
    title: "Entendemos tu operación",
    text: "Analizamos cómo recibís pedidos, cómo trabaja cocina, cómo controlás el stock y dónde se generan errores o demoras.",
    Visual: ChecklistVisual,
  },
  {
    title: "Definimos la solución",
    text: "Seleccionamos únicamente las funciones necesarias y definimos cómo deben conectarse.",
    Visual: ModulesVisual,
  },
  {
    title: "Adaptamos el sistema",
    text: "Configuramos productos, flujos, permisos, reportes y funcionamiento según tu operación.",
    Visual: ProgressVisual,
  },
  {
    title: "Lo ponemos en funcionamiento",
    text: "Capacitamos al equipo, acompañamos la implementación y realizamos ajustes durante la puesta en marcha.",
    Visual: LaunchVisual,
  },
];

export default function HowItWorks() {
  const scrollToForm = () => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="como-funciona" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Proceso"
          title="Cómo implementamos Nexxora en tu restaurante"
          description="No instalamos un sistema genérico. Primero entendemos cómo funciona tu negocio y después adaptamos la solución."
        />

        <div className="relative mt-16">
          <div className="absolute left-6 top-6 bottom-6 hidden w-px bg-gradient-to-b from-brand-cyan via-brand-blue to-brand-purple sm:block lg:left-1/2" />

          <div className="space-y-10 lg:space-y-16">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-start gap-5 lg:w-1/2 ${
                  i % 2 === 0 ? "lg:pr-12" : "lg:ml-auto lg:pl-12"
                }`}
              >
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
                  <span className="text-base font-bold text-white">{i + 1}</span>
                </div>
                <div className="glass rounded-xl2 p-5 flex-1">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
                    Paso {i + 1}
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.text}</p>
                  <step.Visual />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 flex flex-col items-center justify-center gap-4 text-center"
        >
          <p className="text-base font-semibold text-white sm:text-lg">
            Todo comienza entendiendo cómo trabajás hoy.
          </p>
          <Button onClick={scrollToForm}>
            Solicitar diagnóstico gratuito
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
