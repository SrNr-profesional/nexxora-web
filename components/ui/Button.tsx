"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "whatsapp" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

    const variants: Record<string, string> = {
      primary:
        "bg-brand-gradient text-white shadow-glow hover:shadow-[0_0_50px_rgba(59,130,246,0.45)] hover:-translate-y-0.5",
      secondary:
        "glass text-white hover:bg-white/[0.08] hover:-translate-y-0.5",
      whatsapp:
        "bg-[#25D366] text-white hover:bg-[#20bd5a] hover:-translate-y-0.5 shadow-[0_0_25px_rgba(37,211,102,0.35)]",
      ghost: "text-slate-300 hover:text-white hover:bg-white/5",
    };

    const sizes: Record<string, string> = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
