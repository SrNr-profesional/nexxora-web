/**
 * Valores de animación compartidos. Tener un único easing y pocas duraciones
 * hace que toda la página se mueva con el mismo "peso".
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const SPRING_PILL = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 } as const;

/** Aparición estándar al entrar en pantalla. Solo opacity + transform (GPU). */
export const fadeUp = (delay = 0, distance = 18) =>
  ({
    initial: { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  }) as const;

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
