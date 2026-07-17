import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Isotipo de Nexxora: archivo de marca real provisto por el cliente
 * (public/logo-icon.png, recortado del logo original con fondo transparente).
 * El wordmark se mantiene como texto HTML para conservar la tipografía y los
 * efectos de glow consistentes con el resto del sitio.
 */
export default function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <Image
        src="/logo-icon.png"
        alt="Nexxora"
        width={34}
        height={34}
        priority
        style={{ filter: "drop-shadow(0 0 10px rgba(34,211,238,0.5))" }}
      />
      {withText && (
        <span
          className="text-xl font-extrabold tracking-tight text-white"
          style={{ textShadow: "0 0 14px rgba(255,255,255,0.45)" }}
        >
          Nexxora
        </span>
      )}
    </div>
  );
}
