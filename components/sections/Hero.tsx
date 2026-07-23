"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import ConnectedFlow from "@/components/sections/ConnectedFlow";

export default function Hero() {
  const scrollToForm = () =>
    document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });
  const scrollToDemo = () =>
    document.getElementById("soluciones")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="inicio" className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      <AuroraBackground palette="cyan" showNet intensity={1.1} />

      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-cyan"
          >
            Automatización gastronómica inteligente
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Menos errores. Más control.{" "}
            <span className="text-gradient">Un restaurante más eficiente.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
          >
            Conectamos pedidos, cocina, stock, ventas y administración en un sistema diseñado
            alrededor de tu operación.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticWrapper strength={0.3}>
              <Button size="lg" onClick={scrollToForm}>
                Solicitar diagnóstico gratuito
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.3}>
              <Button size="lg" variant="secondary" onClick={scrollToDemo}>
                <PlayCircle className="h-4 w-4" />
                Ver cómo funciona
              </Button>
            </MagneticWrapper>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-5 text-xs font-medium text-slate-500 sm:text-sm"
          >
            Diagnóstico inicial sin compromiso · Sistema personalizado · Acompañamiento durante la
            implementación
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <ConnectedFlow />
        </motion.div>
      </Container>
    </section>
  );
}
