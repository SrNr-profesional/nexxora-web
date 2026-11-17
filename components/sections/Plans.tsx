"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Crown } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { useIndustry } from "@/components/industry/IndustryContext";
import { PLANS, type Plan } from "@/lib/plans";
import { EASE_OUT, scrollToId } from "@/lib/motion";
import { cn } from "@/lib/utils";

function InvestmentLevel({ level }: { level: Plan["level"] }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Nivel de inversión ${level} de 4`}>
      <div className="flex items-end gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={cn("w-1.5 rounded-full", n <= level ? "bg-brand-cyan" : "bg-white/10")}
            style={{ height: 6 + n * 3 }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Inversión</span>
    </div>
  );
}

export default function Plans() {
  const { industry } = useIndustry();

  return (
    <section id="planes" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Planes"
          title="Empezá por lo que necesitás hoy"
          description={`Cuatro niveles que se suman entre sí. Arrancás con uno y ${industry.noun} crece hacia el siguiente cuando tenga sentido.`}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT }}
              className={cn("relative h-full rounded-[1.5rem]", plan.highlight && "plan-premium p-px xl:-my-3")}
            >
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-[1.5rem] p-6",
                  plan.highlight
                    ? "bg-base-900 shadow-[0_30px_80px_-30px_rgba(124,58,237,0.6)] xl:py-9"
                    : "border border-white/10 bg-white/[0.03]"
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-950">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}

                <InvestmentLevel level={plan.level} />
                <h3 className={cn("mt-4 text-lg font-bold", plan.highlight ? "text-gradient" : "text-white")}>
                  {plan.name}
                </h3>
                <p className="mt-1.5 min-h-[40px] text-[13px] leading-relaxed text-slate-400">{plan.tagline}</p>

                <p className="mt-5 text-2xl font-bold tracking-tight text-white">{plan.price ?? "A medida"}</p>
                <p className="text-xs text-slate-500">
                  {plan.price ? "Valor de referencia, sujeto al diagnóstico" : "Cotización según diagnóstico"}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/10 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-300">
                      <Check
                        className={cn("mt-0.5 h-4 w-4 flex-shrink-0", plan.highlight ? "text-amber-300" : "text-emerald-400")}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-7 w-full"
                  variant={plan.highlight ? "primary" : "secondary"}
                  onClick={() => scrollToId("diagnostico")}
                >
                  {plan.highlight ? "Quiero este plan" : "Consultar"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-slate-500">
          El valor final depende de los módulos, la cantidad de sedes y cámaras y el nivel de personalización. Primero
          hacemos un diagnóstico para que no pagues por herramientas que no necesitás.
        </p>
      </Container>
    </section>
  );
}
