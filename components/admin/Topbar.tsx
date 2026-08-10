"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, LogOut, Menu } from "lucide-react";
import type { Profile, AppNotification } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} d`;
}

export default function Topbar({ profile, onOpenSidebar }: { profile: Profile; onOpenSidebar?: () => void }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => d.ok && setNotifications(d.notifications))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/admin/prospectos?search=${encodeURIComponent(search.trim())}`);
  };

  const markAllRead = async () => {
    await fetch("/api/admin/notifications", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const initials = profile.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-base-950/70 px-4 backdrop-blur-xl sm:px-6">
      {onOpenSidebar && (
        <button onClick={onOpenSidebar} className="focus-ring rounded-lg p-2 text-slate-400 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
      )}

      <form onSubmit={onSearch} className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar empresas, contactos, propuestas..."
          className="focus-ring w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-brand-blue"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notificaciones"
            className="focus-ring relative rounded-full p-2 text-slate-400 transition-colors hover:text-white"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-cyan text-[9px] font-bold text-base-950">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-base-900 p-2 shadow-2xl"
              >
                <div className="flex items-center justify-between px-2 py-1.5">
                  <p className="text-xs font-semibold text-white">Notificaciones</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="focus-ring text-[11px] text-brand-cyan">
                      Marcar todas como leídas
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="px-2 py-6 text-center text-xs text-slate-500">Sin notificaciones.</p>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-xs",
                        n.read ? "text-slate-500" : "bg-white/[0.03] text-slate-200"
                      )}
                    >
                      <p>{n.content}</p>
                      <p className="mt-0.5 text-[10px] text-slate-600">{timeAgo(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="focus-ring flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-white/5"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-slate-200 sm:block">{profile.fullName}</span>
          </button>
          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-base-900 p-1.5 shadow-2xl"
              >
                <div className="px-2.5 py-2">
                  <p className="text-sm font-semibold text-white">{profile.fullName}</p>
                  <p className="text-xs text-slate-500">{profile.email}</p>
                </div>
                <div className="my-1 h-px bg-white/10" />
                <a
                  href="/admin/configuracion"
                  className="focus-ring block rounded-lg px-2.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Configuración
                </a>
                <button
                  onClick={logout}
                  className="focus-ring flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
