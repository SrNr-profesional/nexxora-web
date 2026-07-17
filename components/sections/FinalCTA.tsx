"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
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
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-blue/15 via-base-900 to-brand-purple/15 p-10 text-center sm:p-16"
        >
          <div className="absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-radial-glow blur-3xl" />
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full opacity-[0.08]"
            viewBox="0 0 800 400"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="url(#cta-net-line)" strokeWidth="1">
              <line x1="40" y1="60" x2="220" y2="30" />
              <line x1="220" y1="30" x2="420" y2="90" />
              <line x1="420" y1="90" x2="620" y2="40" />
              <line x1="60" y1="340" x2="260" y2="370" />
              <line x1="260" y1="370" x2="480" y2="330" />
              <line x1="480" y1="330" x2="700" y2="360" />
            </g>
            <defs>
              <linearGradient id="cta-net-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>

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
            <Button size="lg" onClick={scrollToForm}>
              Solicitar diagnóstico gratuito
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => window.open(WHATSAPP_DEFAULT_LINK, "_blank")}>
              <MessageCircle className="h-4 w-4" />
              Hablar por WhatsApp
            </Button>
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
