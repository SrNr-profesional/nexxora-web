"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, BellRing, Cctv, Crown, Plug, ScanEye } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import { useIndustry } from "@/components/industry/IndustryContext";
import type { Industry, Tone } from "@/lib/industries";
import { EASE_OUT, scrollToId } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TONE: Record<Tone, { border: string; tag: string; dot: string; text: string; label: string }> = {
  ok: { border: "border-emerald-400/80", tag: "bg-emerald-400 text-emerald-950", dot: "bg-emerald-400", text: "text-emerald-300", label: "OK" },
  warn: { border: "border-amber-400/80", tag: "bg-amber-400 text-amber-950", dot: "bg-amber-400", text: "text-amber-300", label: "Atención" },
  alert: { border: "border-red-400/90", tag: "bg-red-500 text-white", dot: "bg-red-500", text: "text-red-300", label: "Alerta" },
};

/** Posición de cada recuadro de detección dentro del cuadro de cámara (en %). */
const SLOTS = [
  { left: "7%", top: "40%", width: "27%", height: "42%", drift: { x: [0, 10, -4, 0], y: [0, -5, 3, 0] }, duration: 7 },
  { left: "39%", top: "22%", width: "22%", height: "54%", drift: { x: [0, -8, 6, 0], y: [0, 4, -3, 0] }, duration: 9 },
  { left: "68%", top: "44%", width: "25%", height: "38%", drift: { x: [0, 6, -9, 0], y: [0, -3, 5, 0] }, duration: 8 },
];

const CONFIDENCE = [97, 91, 94];

const STEPS = [
  { icon: Plug, title: "Conectamos tus cámaras", text: "Aprovechamos las cámaras IP que ya tenés cuando son compatibles." },
  { icon: ScanEye, title: "Entrenamos las detecciones", text: "Definimos juntos qué debe reconocer la IA en tu operación." },
  { icon: BellRing, title: "Recibís solo lo importante", text: "Alertas con imagen al celular y un panel con el historial." },
];

function CameraFeed({ industry, running }: { industry: Industry; running: boolean }) {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    if (!running) return;
    const tick = () => setClock(new Date().toLocaleTimeString("es-AR", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#060912] shadow-[0_30px_80px_-30px_rgba(124,58,237,0.45)] sm:aspect-video">
      {/* Escena: luz ambiente + piso en perspectiva (estático, sin costo por frame) */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(59,130,246,0.18),transparent_60%)]" />
      <div
        aria-hidden="true"
        className="absolute -inset-x-1/4 bottom-[-18%] h-[75%] opacity-50"
        style={{
          transform: "perspective(520px) rotateX(64deg)",
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.16) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]" />

      {/* Línea de escaneo: solo transform, y solo mientras la sección está visible */}
      {running && (
        <div aria-hidden="true" className="absolute inset-0 motion-safe:animate-scan">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-cyan to-transparent shadow-[0_0_14px_2px_rgba(34,211,238,0.55)]" />
        </div>
      )}

      {/* Detecciones */}
      {industry.vision.detections.map((det, i) => {
        const slot = SLOTS[i % SLOTS.length];
        const tone = TONE[det.tone];
        return (
          <motion.div
            key={`${industry.id}-${det.label}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.14, ease: EASE_OUT }}
            className="absolute"
            style={{ left: slot.left, top: slot.top, width: slot.width, height: slot.height }}
          >
            <motion.div
              className="h-full w-full will-change-transform"
              animate={running ? slot.drift : { x: 0, y: 0 }}
              transition={running ? { duration: slot.duration, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            >
              <div className={cn("relative h-full w-full rounded-md border-[1.5px]", tone.border)}>
                {/* silueta abstracta del objeto detectado */}
                <div className="absolute inset-[16%] rounded-[38%] bg-gradient-to-b from-white/[0.10] to-white/[0.02]" />
                {det.tone === "alert" && running && (
                  <span className="absolute inset-0 rounded-md bg-red-500/10 motion-safe:animate-pulse-glow" />
                )}
                <span
                  className={cn(
                    "absolute -top-[22px] left-[-1.5px] max-w-[190%] truncate rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:text-[10px]",
                    tone.tag
                  )}
                >
                  {det.label} · {CONFIDENCE[i % CONFIDENCE.length]}%
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* HUD */}
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] font-semibold text-white sm:text-[11px]">
        <span className={cn("h-2 w-2 rounded-full bg-red-500", running && "motion-safe:animate-pulse-glow")} />
        REC · CAM 02 · {industry.vision.zone}
      </div>
      <div className="absolute right-3 top-3 rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] text-slate-200 sm:text-[11px]">
        {clock ?? "--:--:--"}
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] text-brand-cyan sm:text-[11px]">
        <ScanEye className="h-3 w-3" /> IA analizando en vivo
      </div>
      <div className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] text-slate-400 sm:text-[11px]">
        Simulación ilustrativa
      </div>
    </div>
  );
}

export default function VisionAI() {
  const { industry } = useIndustry();
  const prefersReducedMotion = useReducedMotion();
  const demoRef = useRef<HTMLDivElement>(null);
  const inView = useInView(demoRef, { amount: 0.25 });
  const running = inView && !prefersReducedMotion;
  const events = industry.vision.events;
  const [activeEvent, setActiveEvent] = useState(0);

  useEffect(() => {
    setActiveEvent(0);
    if (!running) return;
    const id = setInterval(() => setActiveEvent((i) => (i + 1) % events.length), 2600);
    return () => clearInterval(id);
  }, [running, events]);

  const cases = industry.services.filter((s) => s.tier === "vision");

  return (
    <section id="vision-ia" className="relative isolate py-24 sm:py-32">
      <AuroraBackground palette="purple" intensity={0.8} showGrid={false} />
      <Container>
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-200">
            <Crown className="h-3.5 w-3.5" /> Nuestro plan más completo
          </span>
        </div>
        <SectionHeading
          eyebrow="Visión IA con cámaras"
          title="Tus cámaras ya lo graban todo. Ahora también pueden avisarte."
          description={`Sumamos inteligencia artificial a las cámaras de ${industry.noun} para detectar lo que importa en el momento en que ocurre, sin depender de que alguien esté mirando un monitor.`}
        />

        <div ref={demoRef} className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <CameraFeed industry={industry} running={running} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <BellRing className="h-4 w-4 text-brand-cyan" /> Alertas en vivo
              </p>
              <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-slate-400">
                {industry.label}
              </span>
            </div>

            <ul className="flex-1 space-y-2" aria-live="off">
              {events.map((event, i) => {
                const tone = TONE[event.tone];
                const isActive = i === activeEvent;
                return (
                  <li
                    key={`${industry.id}-${event.text}`}
                    className={cn(
                      "relative flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-[opacity,border-color,background-color] duration-500",
                      isActive ? "border-white/20 bg-white/[0.06] opacity-100" : "border-transparent bg-transparent opacity-55"
                    )}
                  >
                    <span className={cn("mt-1.5 h-2 w-2 flex-shrink-0 rounded-full", tone.dot)} />
                    <div className="min-w-0">
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest", tone.text)}>{tone.label}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-slate-200">{event.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-500">
              Cada alerta llega con la imagen del evento por WhatsApp y queda registrada en el panel.
            </p>
          </motion.div>
        </div>

        {/* Casos de uso del rubro */}
        <motion.ul
          key={industry.id}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cases.map((item) => (
            <motion.li
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
              }}
              className="rounded-xl2 border border-brand-purple/25 bg-gradient-to-br from-brand-purple/[0.10] to-transparent p-5 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-purple/55"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
                <item.icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold leading-snug text-white">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{item.text}</p>
            </motion.li>
          ))}
        </motion.ul>

        {/* Cómo se implementa */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE_OUT }}
              className="flex items-start gap-3.5 rounded-xl2 border border-white/10 bg-white/[0.02] p-5"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                <step.icon className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  <span className="mr-1.5 text-brand-cyan">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticWrapper strength={0.25}>
              <Button size="lg" onClick={() => scrollToId("diagnostico")}>
                <Cctv className="h-4 w-4" />
                Quiero evaluar mis cámaras
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
            <Button size="lg" variant="secondary" onClick={() => scrollToId("planes")}>
              Ver planes
            </Button>
          </div>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-500">
            La viabilidad de cada detección depende de la ubicación, la calidad y la iluminación de las cámaras; lo
            validamos sin costo en el diagnóstico. El tratamiento de imágenes se configura respetando la normativa
            vigente de protección de datos personales.
          </p>
        </div>
      </Container>
    </section>
  );
}
