"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  actions,
  widthClassName = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
  widthClassName?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-white/10 bg-base-950 shadow-2xl ${widthClassName}`}
          >
            <div className="flex items-start justify-between border-b border-white/10 p-6 sm:p-7">
              <div>
                {eyebrow && <p className="text-xs text-slate-500">{eyebrow}</p>}
                <h2 className="text-xl font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="focus-ring rounded-lg p-1.5 text-slate-400 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-7">{children}</div>

            {actions && <div className="border-t border-white/10 p-4 sm:p-5">{actions}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
