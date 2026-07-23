"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Layers, Zap, SlidersHorizontal } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TiltCard from "@/components/ui/TiltCard";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import { DemoProvider, useDemo } from "@/components/solutions/DemoContext";
import BusinessTypeSelector from "@/components/solutions/BusinessTypeSelector";
import SolutionNavigation, { SolutionModuleId, SOLUTION_MODULES } from "@/components/solutions/SolutionNavigation";
import DemoResetButton from "@/components/solutions/DemoResetButton";
import NoticeToast from "@/components/solutions/NoticeToast";
import DigitalMenuDemo from "@/components/solutions/modules/DigitalMenuDemo";
import OnlineOrderDemo from "@/components/solutions/modules/OnlineOrderDemo";
import KitchenDisplayDemo from "@/components/solutions/modules/KitchenDisplayDemo";
import StockDemo from "@/components/solutions/modules/StockDemo";
import AdminDashboardDemo from "@/components/solutions/modules/AdminDashboardDemo";
import LoyaltyDemo from "@/components/solutions/modules/LoyaltyDemo";
import DeliveryDemo from "@/components/solutions/modules/DeliveryDemo";
import AIAutomationDemo from "@/components/solutions/modules/AIAutomationDemo";
import { WHATSAPP_DEFAULT_LINK } from "@/lib/constants";

const HIGHLIGHTS = [
  { icon: Layers, label: "8 módulos conectados entre sí" },
  { icon: Zap, label: "La información se actualiza en tiempo real" },
  { icon: SlidersHorizontal, label: "Se adapta al rubro de tu negocio" },
];

const MODULE_COMPONENTS: Record<SolutionModuleId, React.ComponentType> = {
  menu: DigitalMenuDemo,
  pedidos: OnlineOrderDemo,
  cocina: KitchenDisplayDemo,
  stock: StockDemo,
  admin: AdminDashboardDemo,
  clientes: LoyaltyDemo,
  delivery: DeliveryDemo,
  ia: AIAutomationDemo,
};

function SolutionsPanel() {
  const { state, setBusinessType } = useDemo();
  const [activeModule, setActiveModule] = useState<SolutionModuleId>("menu");
  const ActiveComponent = MODULE_COMPONENTS[activeModule];
  const activeLabel = SOLUTION_MODULES.find((m) => m.id === activeModule)?.label;

  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <BusinessTypeSelector value={state.businessType} onChange={setBusinessType} />
        <DemoResetButton />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <SolutionNavigation active={activeModule} onChange={setActiveModule} />

        <TiltCard maxTilt={3} className="min-h-[560px] lg:min-h-[600px]">
          <div className="relative h-full min-h-[560px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)] sm:p-7 lg:min-h-[600px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute -top-16 right-10 h-48 w-48 rounded-full bg-brand-blue/15 blur-3xl transition-all duration-700" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-10 h-48 w-48 rounded-full bg-brand-purple/15 blur-3xl transition-all duration-700" />

            <NoticeToast />

            <h3 className="sr-only">{activeLabel}</h3>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                id={`solution-panel-${activeModule}`}
                role="tabpanel"
                aria-labelledby={`solution-tab-${activeModule}`}
                initial={{ opacity: 0, y: 16, rotateX: 6, scale: 0.98, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, rotateX: -4, scale: 0.99, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative"
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </TiltCard>
      </div>
    </>
  );
}

export default function RestaurantSolutionsSection() {
  const scrollToForm = () => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="soluciones" className="relative py-24 sm:py-32">
      <AuroraBackground palette="purple" intensity={0.7} />
      <Container>
        <SectionHeading
          eyebrow="Plataforma todo-en-uno"
          title="Un sistema diseñado alrededor de tu restaurante"
          description="Menú digital, pedidos online, cocina, stock, administración, clientes, delivery e inteligencia artificial: ocho módulos que comparten la misma información y trabajan juntos para reducir errores, ahorrar tiempo y darte control total sobre tu operación. Elegí el tipo de negocio de abajo y probá cada herramienta como la usaría tu equipo, con datos reales de ejemplo."
        />

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex items-center gap-2 text-sm text-slate-400">
              <h.icon className="h-4 w-4 shrink-0 text-brand-cyan" />
              {h.label}
            </div>
          ))}
        </div>

        <DemoProvider>
          <SolutionsPanel />
        </DemoProvider>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-brand-blue/10 via-base-900 to-brand-purple/10 p-8 text-center shadow-card sm:p-10"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <h3 className="text-xl font-bold text-white sm:text-2xl">Cada restaurante funciona de una manera distinta.</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
            Seleccionamos y adaptamos únicamente las herramientas que realmente necesita tu operación.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticWrapper strength={0.25}>
              <Button onClick={scrollToForm}>
                Quiero mi diagnóstico gratuito
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.25}>
              <Button variant="secondary" onClick={() => window.open(WHATSAPP_DEFAULT_LINK, "_blank")}>
                <MessageCircle className="h-4 w-4" />
                Hablar por WhatsApp
              </Button>
            </MagneticWrapper>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
