"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellRing } from "lucide-react";
import { useDemo } from "./DemoContext";

export default function NoticeToast() {
  const { state } = useDemo();

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-30 sm:right-6 sm:top-6" aria-live="polite">
      <AnimatePresence>
        {state.notice && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg"
          >
            <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
            {state.notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
