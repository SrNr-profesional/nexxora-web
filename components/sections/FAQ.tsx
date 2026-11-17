"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const FAQS = [
  {
    q: "¿Trabajan con cualquier rubro?",
    a: "Sí. Tenemos soluciones armadas para gastronomía, logística y transporte, retail, industria, construcción, agro y bodegas, salud, barrios y consorcios, hotelería y minería. Si tu rubro no está en la lista, igual hacemos el diagnóstico y diseñamos la solución a medida.",
  },
  {
    q: "¿Necesito cambiar todo mi método de trabajo?",
    a: "No. El sistema se adapta a tu operación actual y se incorpora de forma gradual, sin necesidad de cambiar todo de golpe.",
  },
  {
    q: "¿Se puede empezar con una sola función?",
    a: "Sí. Podés comenzar digitalizando un solo proceso e ir sumando módulos, automatizaciones con IA o cámaras a medida que lo necesites.",
  },
  {
    q: "¿El sistema funciona desde el celular?",
    a: "Sí. Los paneles y las alertas están pensados para usarse desde el celular, además de la computadora.",
  },
  {
    q: "¿Se puede utilizar en varias sucursales?",
    a: "Sí. El sistema puede configurarse para gestionar varias sucursales de forma centralizada.",
  },
  {
    q: "¿Se puede integrar con WhatsApp?",
    a: "Sí. Se usa como canal de atención, de notificaciones y de alertas, incluyendo las que generan las cámaras.",
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
    a: "El valor depende de las funciones, la cantidad de sedes y cámaras y el nivel de personalización. Primero realizamos un diagnóstico para evitar que pagues por herramientas que no necesitás.",
  },
  {
    q: "¿Qué es Visión IA con cámaras?",
    a: "Es inteligencia artificial que analiza en tiempo real el video de tus cámaras y te avisa cuando ocurre algo que definimos juntos: una persona sin casco, una góndola vacía, un vehículo no autorizado, una fila demasiado larga. Es nuestro plan más completo.",
  },
  {
    q: "¿Necesito comprar cámaras nuevas?",
    a: "No siempre. Si ya tenés cámaras IP con buena ubicación y calidad de imagen, las aprovechamos. En el diagnóstico revisamos cuáles sirven y, si hace falta sumar alguna, te indicamos cuál y dónde.",
  },
  {
    q: "¿Qué pasa con la privacidad de las personas filmadas?",
    a: "Cada implementación se configura según la normativa de protección de datos personales: cartelería, zonas que no se analizan, plazos de guardado y acceso restringido a las imágenes. Siempre que es posible trabajamos con detecciones anónimas (conteo, presencia, EPP) sin identificar personas.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Dudas frecuentes" title="Preguntas frecuentes" />

        <div className="mx-auto mt-14 max-w-3xl divide-y divide-white/10 overflow-hidden rounded-xl2 glass shadow-card">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`px-6 transition-colors duration-300 ${isOpen ? "bg-white/[0.03]" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className={`text-sm font-semibold transition-colors duration-300 sm:text-base ${isOpen ? "text-brand-cyan" : "text-white"}`}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-brand-cyan transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
