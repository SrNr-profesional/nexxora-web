"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import { WHATSAPP_DEFAULT_LINK } from "@/lib/constants";

export default function FinalCTA() {
  const scrollToForm = () => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="contacto" className="relative py-24 sm:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-blue/15 via-base-900 to-brand-purple/15 p-10 text-center shadow-card sm:p-16"
        >
          <AuroraBackground palette="blue" showNet intensity={1} showGrid={false} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tu restaurante no necesita trabajar más.
            <br />
            <span className="text-gradient">Necesita trabajar mejor.</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
            Contanos qué procesos te hacen perder tiempo y diseñaremos una solución alrededor de tu
            operación.
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticWrapper strength={0.3}>
              <Button size="lg" onClick={scrollToForm}>
                Solicitar diagnóstico gratuito
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.3}>
              <Button size="lg" variant="secondary" onClick={() => window.open(WHATSAPP_DEFAULT_LINK, "_blank")}>
                <MessageCircle className="h-4 w-4" />
                Hablar por WhatsApp
              </Button>
            </MagneticWrapper>
          </div>

          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span>Diagnóstico inicial sin compromiso</span>
            <span className="text-slate-700">·</span>
            <span>Solución personalizada</span>
            <span className="text-slate-700">·</span>
            <span>Implementación acompañada</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
