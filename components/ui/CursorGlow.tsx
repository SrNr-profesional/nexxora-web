"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Halo radial que sigue el cursor en desktop. La posición vive en motion
 * values (no en estado de React), así que mover el mouse no re-renderiza nada.
 *
 * Sin `filter: blur()` ni `mix-blend-mode`: el degradado radial ya es suave y
 * esas dos propiedades obligaban a recomponer media pantalla en cada
 * movimiento del mouse.
 */
export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [prefersReducedMotion, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[640px] w-[640px] will-change-transform"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(closest-side, rgba(34,211,238,0.085) 0%, rgba(124,58,237,0.045) 45%, transparent 100%)",
      }}
    />
  );
}
