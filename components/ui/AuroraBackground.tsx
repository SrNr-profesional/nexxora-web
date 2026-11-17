"use client";

import { useId, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const PALETTES = {
  cyan: ["rgba(34,211,238,0.14)", "rgba(124,58,237,0.14)"],
  purple: ["rgba(124,58,237,0.14)", "rgba(59,130,246,0.12)"],
  blue: ["rgba(59,130,246,0.14)", "rgba(34,211,238,0.1)"],
} as const;

/**
 * Fondo decorativo de sección con parallax suave.
 *
 * Rendimiento: los halos son degradados radiales que ya se difuminan solos,
 * así que NO llevan `filter: blur()`. Antes cada halo (hasta 900×520px, tres
 * por sección, cinco secciones) se difuminaba por GPU y además se movía con
 * el scroll, que era el mayor costo de pintado de toda la página.
 *
 * La sección que lo contiene debe tener `relative isolate` para que el
 * `-z-10` quede detrás de su contenido y no detrás del fondo de la página.
 */
export default function AuroraBackground({
  palette = "cyan",
  showGrid = true,
  showNet = false,
  intensity = 1,
  className,
}: {
  palette?: keyof typeof PALETTES;
  showGrid?: boolean;
  showNet?: boolean;
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [colorA, colorB] = PALETTES[palette];

  const yA = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yB = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {showGrid && <div className="absolute inset-0 grid-overlay opacity-70" />}

      <motion.div
        style={{
          y: yA,
          x: "-50%",
          opacity: intensity,
          background: `radial-gradient(closest-side, ${colorA}, transparent)`,
        }}
        className="absolute -top-56 left-1/2 h-[680px] w-[1100px] max-w-none will-change-transform"
      />

      <motion.div
        style={{ y: yB, opacity: intensity, background: `radial-gradient(closest-side, ${colorB}, transparent)` }}
        className="absolute right-[2%] top-16 h-[420px] w-[420px] will-change-transform"
      />

      <div
        className="absolute -top-16 left-[4%] h-[380px] w-[380px]"
        style={{ opacity: intensity, background: "radial-gradient(closest-side, rgba(34,211,238,0.10), transparent)" }}
      />

      {showNet && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.14]"
          viewBox="0 0 1200 700"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <g stroke={`url(#${gradientId})`} strokeWidth="1">
            <line x1="80" y1="120" x2="320" y2="60" />
            <line x1="320" y1="60" x2="560" y2="150" />
            <line x1="560" y1="150" x2="820" y2="70" />
            <line x1="820" y1="70" x2="1080" y2="160" />
            <line x1="120" y1="560" x2="380" y2="620" />
            <line x1="380" y1="620" x2="640" y2="540" />
            <line x1="640" y1="540" x2="900" y2="610" />
            <line x1="900" y1="610" x2="1140" y2="540" />
          </g>
          <g fill="#22d3ee">
            <circle cx="80" cy="120" r="3" />
            <circle cx="320" cy="60" r="3" />
            <circle cx="560" cy="150" r="3" />
            <circle cx="820" cy="70" r="3" />
            <circle cx="1080" cy="160" r="3" />
            <circle cx="120" cy="560" r="3" />
            <circle cx="380" cy="620" r="3" />
            <circle cx="640" cy="540" r="3" />
            <circle cx="900" cy="610" r="3" />
            <circle cx="1140" cy="540" r="3" />
          </g>
        </svg>
      )}
    </div>
  );
}
