"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function Card({
  className,
  hover = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass rounded-xl2 p-6 shadow-card transition-all duration-300",
        hover && "hover:-translate-y-1 hover:border-brand-blue/40 hover:bg-white/[0.06]",
        className
      )}
      {...(props as any)}
    />
  );
}
