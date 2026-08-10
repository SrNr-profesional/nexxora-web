"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { MOBILE_PRIORITY } from "@/lib/crm/nav";
import { cn } from "@/lib/utils";
import QuickVisitLog from "./QuickVisitLog";

export default function MobileTabBar() {
  const pathname = usePathname();
  const [logOpen, setLogOpen] = useState(false);
  const [left, right] = [MOBILE_PRIORITY.slice(0, 2), MOBILE_PRIORITY.slice(2)];

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-around border-t border-white/10 bg-base-950/95 px-2 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {left.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium",
                active ? "text-brand-cyan" : "text-slate-500"
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={() => setLogOpen(true)}
          aria-label="Registrar visita"
          className="focus-ring -mt-6 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow"
        >
          <Plus className="h-6 w-6" />
        </button>

        {right.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium",
                active ? "text-brand-cyan" : "text-slate-500"
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <QuickVisitLog open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}
