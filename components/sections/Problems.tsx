"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardX,
  Clock,
  ListX,
  PackageSearch,
  PackageX,
  MessagesSquare,
  Tag,
  BarChart3,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TiltCard from "@/components/ui/TiltCard";
import AuroraBackground from "@/components/ui/AuroraBackground";

const PROBLEMS = [
  {
    icon: ClipboardX,
    title: "Pedidos incorrectos",
    consequence: "Un error en la nota significa rehacer el plato y un cliente esperando de más.",
    before: ["Nota escrita a mano", "Modificación mal interpretada", "Pedido rehecho", "Cliente esperando"],
    after: ["Pedido estructurado", "Modificaciones registradas", "Cocina recibe información exacta", "Número y estado visibles"],
  },
  {
    icon: Clock,
    title: "Demoras entre salón y cocina",
    consequence: "Cada viaje entre el salón y la cocina suma minutos que el cliente sí nota.",
    before: ["Mozo anota en papel", "Camina hasta la cocina", "Cocina interpreta la letra", "El pedido arranca tarde"],
    after: ["El pedido se envía al instante", "Cocina lo recibe en pantalla", "Se prioriza automáticamente", "Arranca sin demoras"],
  },
  {
    icon: ListX,
    title: "Pedidos perdidos o duplicados",
    consequence: "Sin un registro único, un pedido puede cobrarse dos veces o no llegar nunca.",
    before: ["Comandas sueltas", "Pedidos que se traspapelan", "Se cobra dos veces o no se cobra", "Nadie sabe qué pasó"],
    after: ["Cada pedido con número único", "Estado visible para todo el equipo", "Historial completo y trazable", "Nada se pierde"],
  },
  {
    icon: PackageSearch,
    title: "Falta de control de stock",
    consequence: "Sin datos reales, te enterás que falta un insumo cuando ya es tarde.",
    before: ["Stock calculado a ojo", "Planillas desactualizadas", "Sorpresas a mitad de servicio", "Compras de urgencia"],
    after: ["Se descuenta con cada venta", "Alertas antes de quedarte sin insumos", "Historial de consumo real", "Compras planificadas"],
  },
  {
    icon: PackageX,
    title: "Productos agotados que siguen disponibles",
    consequence: "Vender algo que no tenés genera un pedido que después hay que cancelar.",
    before: ["El menú sigue mostrando el producto", "El cliente lo pide igual", "Hay que cancelarlo después", "Mala experiencia"],
    after: ["Se marca agotado automáticamente", "El cliente no puede pedirlo", "Se reactiva solo al reponer stock", "Cero cancelaciones por error"],
  },
  {
    icon: MessagesSquare,
    title: "Exceso de mensajes por WhatsApp",
    consequence: "Un chat saturado hace que un pedido se mezcle con una simple consulta.",
    before: ["Decenas de chats simultáneos", "Pedidos mezclados con consultas", "Fácil perder un mensaje", "Respuestas tardías"],
    after: ["El cliente pide desde un link propio", "El pedido llega ordenado al sistema", "WhatsApp queda libre para consultas", "Nada se mezcla"],
  },
  {
    icon: Tag,
    title: "Dificultad para actualizar precios",
    consequence: "Cada aumento de precio implica reimprimir cartas y avisar a todo el equipo.",
    before: ["Reimprimir el menú", "Avisar a todo el equipo", "Demora entre el cambio y su aplicación", "Errores de cobro"],
    after: ["Editás el precio en segundos", "Se actualiza en todos los canales", "Sin reimprimir nada", "Sin errores de cobro"],
  },
  {
    icon: BarChart3,
    title: "Falta de estadísticas de ventas",
    consequence: "Sin datos claros, es difícil saber qué producto realmente te conviene vender.",
    before: ["Decisiones a intuición", "Cierre de caja manual", "No sabés qué producto conviene", "Datos dispersos"],
    after: ["Panel con ventas en tiempo real", "Producto más vendido a la vista", "Reportes automáticos", "Decisiones con datos reales"],
  },
];

export default function Problems() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? PROBLEMS[activeIndex] : null;

  const scrollToDemo = () => document.getElementById("soluciones")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="problemas" className="relative py-24 sm:py-32">
      <AuroraBackground palette="blue" intensity={0.55} showGrid={false} />
      <Container>
        <SectionHeading
          eyebrow="Diagnóstico rápido"
          title="¿Estos problemas ocurren en tu restaurante?"
          description="Seleccioná un problema para ver cómo Nexxora podría simplificarlo."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <TiltCard key={item.title} maxTilt={6} className="h-full min-h-[190px]">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                  onClick={() => setActiveIndex(isActive ? null : i)}
                  aria-pressed={isActive}
                  className={`focus-ring group relative flex h-full min-h-[190px] w-full flex-col rounded-xl2 border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-brand-blue/50 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 shadow-glow"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 ${
                      isActive ? "bg-brand-gradient" : "bg-white/[0.06] group-hover:bg-white/10"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-brand-cyan"}`} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-white">{item.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.consequence}</p>
                  <span
                    className={`mt-auto flex items-center gap-1 pt-4 text-xs font-semibold transition-colors ${
                      isActive ? "text-brand-cyan" : "text-slate-500 group-hover:text-white"
                    }`}
                  >
                    Ver solución
                    <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isActive ? "rotate-90" : ""}`} />
                  </span>
                </motion.button>
              </TiltCard>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.title}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card sm:p-8"
              >
                <p className="mb-6 text-center text-sm font-semibold text-white">{active.title}</p>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Antes</p>
                    <ul className="space-y-2.5">
                      {active.before.map((line) => (
                        <li key={line} className="flex items-start gap-2 text-sm text-slate-400">
                          <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-400/70" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-center py-2 sm:py-0">
                    <div className="flex h-10 w-10 rotate-90 items-center justify-center rounded-full bg-brand-gradient shadow-glow sm:rotate-0">
                      <ArrowRight className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="rounded-xl2 border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-cyan">Con Nexxora</p>
                    <ul className="space-y-2.5">
                      {active.after.map((line) => (
                        <li key={line} className="flex items-start gap-2 text-sm text-slate-200">
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 flex flex-col items-center justify-center gap-4 text-center"
        >
          <p className="text-base font-semibold text-white sm:text-lg">
            ¿Reconociste uno o más de estos problemas?
          </p>
          <Button onClick={scrollToDemo}>
            Ver cómo lo resolvemos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
