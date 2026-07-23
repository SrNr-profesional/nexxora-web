"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Blob radial que sigue el cursor en desktop. No usa estado de React para la
 * posición (motion values + spring) para no re-renderizar en cada mousemove.
 */
export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canHover = window.matchMedia("(pointer: fine)").matches;
    if (!canHover) return;
    setEnabled(true);

    const handleMove = (e: PointerEvent) => {
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
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[520px] w-[520px] rounded-full opacity-[0.15] mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(124,58,237,0.25) 45%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}
