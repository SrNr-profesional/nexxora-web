"use client";

import { motion } from "framer-motion";
import { QrCode, ShoppingCart, Monitor, Package, ChartNoAxesCombined, Users, Bike, Sparkles, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SolutionModuleId =
  | "menu"
  | "pedidos"
  | "cocina"
  | "stock"
  | "admin"
  | "clientes"
  | "delivery"
  | "ia";

export const SOLUTION_MODULES: { id: SolutionModuleId; label: string; icon: LucideIcon }[] = [
  { id: "menu", label: "Menú digital", icon: QrCode },
  { id: "pedidos", label: "Pedidos online", icon: ShoppingCart },
  { id: "cocina", label: "Pantalla de cocina", icon: Monitor },
  { id: "stock", label: "Control de stock", icon: Package },
  { id: "admin", label: "Panel administrativo", icon: ChartNoAxesCombined },
  { id: "clientes", label: "Clientes y fidelización", icon: Users },
  { id: "delivery", label: "Delivery y retiro", icon: Bike },
  { id: "ia", label: "Automatizaciones e IA", icon: Sparkles },
];

export default function SolutionNavigation({
  active,
  onChange,
}: {
  active: SolutionModuleId;
  onChange: (id: SolutionModuleId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Módulos del sistema Nexxora"
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
    >
      {SOLUTION_MODULES.map((m) => {
        const isActive = active === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            id={`solution-tab-${m.id}`}
            aria-selected={isActive}
            aria-controls={`solution-panel-${m.id}`}
            onClick={() => onChange(m.id)}
            className={cn(
              "focus-ring group relative flex flex-shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-colors duration-300 lg:whitespace-normal",
              isActive ? "text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="solution-tab-pill"
                aria-hidden="true"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-brand-cyan/90 via-brand-blue to-brand-purple shadow-glow"
              />
            )}
            <m.icon
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform duration-300",
                isActive && "scale-110"
              )}
              aria-hidden="true"
            />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
