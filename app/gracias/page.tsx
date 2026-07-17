"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { buildWhatsappLink, WHATSAPP_THANKYOU_LINK } from "@/lib/constants";

interface Summary {
  restaurantName?: string;
  mainProblem?: string;
  desiredFeatures?: string[];
  contactPreference?: string;
}

export default function GraciasPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("nexxora_diagnostic_summary");
    if (raw) {
      try {
        setSummary(JSON.parse(raw));
      } catch {
        setSummary(null);
      }
    }
  }, []);

  const whatsappLink = summary?.restaurantName
    ? buildWhatsappLink(
        `Hola, completé el diagnóstico para ${summary.restaurantName}. Nuestro principal problema es ${
          summary.mainProblem || "mejorar la operación"
        } y nos interesa ${(summary.desiredFeatures || []).join(", ") || "conocer más sobre el sistema"}.`
      )
    : WHATSAPP_THANKYOU_LINK;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20">
      <div className="absolute inset-0 -z-10 grid-overlay" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-radial-glow blur-3xl" />

      <Container className="flex max-w-xl flex-col items-center text-center">
        <a href="/" className="mb-10">
          <Logo />
        </a>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Recibimos el diagnóstico de tu restaurante
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-4 text-base text-slate-400"
        >
          Vamos a revisar la información para identificar qué procesos podrías simplificar o automatizar.
        </motion.p>

        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-8 w-full space-y-3 rounded-xl2 glass p-6 text-left"
          >
            {summary.restaurantName && (
              <SummaryRow label="Restaurante" value={summary.restaurantName} />
            )}
            {summary.mainProblem && <SummaryRow label="Principal problema" value={summary.mainProblem} />}
            {summary.desiredFeatures && summary.desiredFeatures.length > 0 && (
              <SummaryRow label="Funciones de interés" value={summary.desiredFeatures.join(", ")} />
            )}
            {summary.contactPreference && (
              <SummaryRow label="Preferencia de contacto" value={summary.contactPreference} />
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button size="lg" variant="whatsapp" onClick={() => window.open(whatsappLink, "_blank")}>
            <MessageCircle className="h-4 w-4" />
            Continuar por WhatsApp
          </Button>
          <Button size="lg" variant="secondary" onClick={() => (window.location.href = "/")}>
            <Home className="h-4 w-4" />
            Volver al inicio
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/10 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-sm text-slate-200 sm:text-right">{value}</span>
    </div>
  );
}
