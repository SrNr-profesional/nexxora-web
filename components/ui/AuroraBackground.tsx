"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const PALETTES = {
  cyan: ["rgba(34,211,238,0.14)", "rgba(124,58,237,0.14)"],
  purple: ["rgba(124,58,237,0.14)", "rgba(59,130,246,0.12)"],
  blue: ["rgba(59,130,246,0.14)", "rgba(34,211,238,0.1)"],
} as const;

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
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [colorA, colorB] = PALETTES[palette];

  const yA = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-60, 60]);
  const yB = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [40, -40]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {showGrid && <div className="absolute inset-0 grid-overlay opacity-70" />}

      <motion.div
        style={{ y: yA }}
        className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: `radial-gradient(circle, ${colorA}, transparent 60%)`, opacity: intensity }}
        />
      </motion.div>

      <motion.div
        style={{ y: yB }}
        className="absolute top-24 right-[6%] h-72 w-72 rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: `radial-gradient(circle, ${colorB}, transparent 60%)`, opacity: intensity }}
        />
      </motion.div>

      <div className="absolute -top-10 left-[8%] h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl" style={{ opacity: intensity }} />

      {showNet && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.14]"
          viewBox="0 0 1200 700"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="aurora-net-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <g stroke="url(#aurora-net-line)" strokeWidth="1">
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
