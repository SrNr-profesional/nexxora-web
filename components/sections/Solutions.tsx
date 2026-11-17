"use client";

import RestaurantSolutionsSection from "@/components/sections/RestaurantSolutionsSection";
import IndustrySolutions from "@/components/sections/IndustrySolutions";
import { useIndustry } from "@/components/industry/IndustryContext";

/**
 * Gastronomía conserva su demo interactiva de 8 módulos; el resto de los
 * rubros muestra su catálogo de soluciones. Ambas usan id="soluciones".
 */
export default function Solutions() {
  const { industry } = useIndustry();
  return industry.id === "gastronomia" ? <RestaurantSolutionsSection /> : <IndustrySolutions />;
}
