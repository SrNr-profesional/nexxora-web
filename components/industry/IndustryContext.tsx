"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { DEFAULT_INDUSTRY, getIndustry, INDUSTRIES, type Industry, type IndustryId } from "@/lib/industries";
import { buildWhatsappLink } from "@/lib/constants";

interface IndustryContextValue {
  industry: Industry;
  setIndustry: (id: IndustryId) => void;
  whatsappLink: string;
}

const IndustryContext = createContext<IndustryContextValue | null>(null);

const PARAM = "rubro";

/**
 * Rubro activo de la landing. Se sincroniza con ?rubro= para poder compartir
 * un link directo (ej: nexxora.com.ar/?rubro=logistica) y usarlo en anuncios.
 * También aplica prefers-reduced-motion a todas las animaciones de Framer.
 */
export function IndustryProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<IndustryId>(DEFAULT_INDUSTRY);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
    if (fromUrl && INDUSTRIES.some((i) => i.id === fromUrl)) setId(fromUrl as IndustryId);
  }, []);

  const setIndustry = useCallback((next: IndustryId) => {
    setId(next);
    const url = new URL(window.location.href);
    if (next === DEFAULT_INDUSTRY) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, next);
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const value = useMemo<IndustryContextValue>(() => {
    const industry = getIndustry(id);
    return {
      industry,
      setIndustry,
      whatsappLink: buildWhatsappLink(
        `Hola, quiero conocer las soluciones de Nexxora para ${industry.label.toLowerCase()}.`
      ),
    };
  }, [id, setIndustry]);

  return (
    <MotionConfig reducedMotion="user">
      <IndustryContext.Provider value={value}>{children}</IndustryContext.Provider>
    </MotionConfig>
  );
}

export function useIndustry() {
  const ctx = useContext(IndustryContext);
  if (!ctx) throw new Error("useIndustry debe usarse dentro de <IndustryProvider>");
  return ctx;
}

/** Para componentes que también se usan fuera de la home (header, footer). */
export function useIndustryOptional() {
  return useContext(IndustryContext);
}
