"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const FAQS = [
  {
    q: "¿El sistema funciona para cualquier tipo de restaurante?",
    a: "Sí. Se adapta a restaurantes, hamburgueserías, pizzerías, cafeterías, bares, sushi, comida rápida, rotiserías y otros formatos gastronómicos.",
  },
  {
    q: "¿Necesito cambiar todo mi método de trabajo?",
    a: "No. El sistema se adapta a tu operación actual y se incorpora de forma gradual, sin necesidad de cambiar todo de golpe.",
  },
  {
    q: "¿Se puede empezar solamente con un menú digital?",
    a: "Sí. Podés comenzar con una sola función, como el menú digital, e ir sumando módulos a medida que lo necesites.",
  },
  {
    q: "¿El sistema funciona desde el celular?",
    a: "Sí. Tanto la vista del cliente como el panel administrativo están pensados para usarse desde el celular.",
  },
  {
    q: "¿Se puede utilizar en varias sucursales?",
    a: "Sí. El sistema puede configurarse para gestionar varias sucursales de forma centralizada.",
  },
  {
    q: "¿Se puede integrar con WhatsApp?",
    a: "Sí. Se puede integrar como canal de contacto y notificaciones dentro del flujo de pedidos.",
  },
  {
    q: "¿El personal necesita conocimientos técnicos?",
    a: "No. El sistema está diseñado para ser simple de usar, incluso para equipos sin experiencia tecnológica.",
  },
  {
    q: "¿Qué sucede si necesito agregar una función más adelante?",
    a: "Podés incorporar nuevos módulos cuando lo necesites, sin tener que rehacer el sistema.",
  },
  {
    q: "¿El sistema tiene mantenimiento?",
    a: "Sí. Incluye acompañamiento y soporte para que la operación funcione correctamente.",
  },
  {
    q: "¿Cómo se define el precio?",
    a: "El valor depende de las funciones, la cantidad de sucursales y el nivel de personalización. Primero realizamos un diagnóstico para evitar que pagues por herramientas que no necesitás.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Dudas frecuentes" title="Preguntas frecuentes" />

        <div className="mx-auto mt-14 max-w-3xl divide-y divide-white/10 rounded-xl2 glass">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="px-6">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-white sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-brand-cyan transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-slate-400">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
