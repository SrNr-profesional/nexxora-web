"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { NAV_GROUPS } from "@/lib/crm/nav";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nexxora_sidebar_collapsed");
    if (stored) setCollapsed(stored === "true");
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("nexxora_sidebar_collapsed", String(!prev));
      return !prev;
    });
  };

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-shrink-0 flex-col border-r border-white/10 bg-base-950/60 backdrop-blur-xl transition-all duration-300 lg:flex",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/admin">
            <Logo />
          </Link>
        )}
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          className="focus-ring ml-auto rounded-lg p-1.5 text-slate-500 transition-colors hover:text-white"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "focus-ring group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-200",
                      active ? "text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-brand-blue/20 to-brand-purple/10 ring-1 ring-brand-blue/25"
                      />
                    )}
                    <item.icon className="h-[18px] w-[18px] flex-shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
