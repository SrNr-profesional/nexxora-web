"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  LogOut,
  Users,
  Sparkles,
  CalendarCheck,
  FileText,
  Trophy,
  Percent,
  ArrowUpDown,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { ContactRecord, ContactStatus, CONTACT_STATUS_LABELS } from "@/types/contact";
import ContactDrawer from "@/components/admin/ContactDrawer";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: (ContactStatus | "all")[] = [
  "all",
  "nuevo",
  "contactado",
  "reunion_agendada",
  "propuesta_enviada",
  "negociacion",
  "cliente_cerrado",
  "no_interesado",
];

const STATUS_COLORS: Record<ContactStatus, string> = {
  nuevo: "bg-brand-blue/15 text-brand-cyan",
  contactado: "bg-amber-500/15 text-amber-400",
  reunion_agendada: "bg-violet-500/15 text-violet-300",
  propuesta_enviada: "bg-cyan-500/15 text-cyan-300",
  negociacion: "bg-orange-500/15 text-orange-300",
  cliente_cerrado: "bg-emerald-500/15 text-emerald-400",
  no_interesado: "bg-slate-500/15 text-slate-400",
};

interface Kpis {
  total: number;
  nuevos: number;
  reunionesAgendadas: number;
  propuestasEnviadas: number;
  clientesCerrados: number;
  tasaConversion: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContactStatus | "all">("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<ContactRecord | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    params.set("sort", sortAsc ? "asc" : "desc");

    const res = await fetch(`/api/admin/contacts?${params.toString()}`);
    const result = await res.json();
    if (result.ok) {
      setContacts(result.contacts);
      setKpis(result.kpis);
    }
    setLoading(false);
  }, [search, status, sortAsc]);

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
  }, [load]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const kpiCards = useMemo(
    () => [
      { icon: Users, label: "Contactos totales", value: kpis?.total ?? "—" },
      { icon: Sparkles, label: "Nuevos", value: kpis?.nuevos ?? "—" },
      { icon: CalendarCheck, label: "Reuniones agendadas", value: kpis?.reunionesAgendadas ?? "—" },
      { icon: FileText, label: "Propuestas enviadas", value: kpis?.propuestasEnviadas ?? "—" },
      { icon: Trophy, label: "Clientes cerrados", value: kpis?.clientesCerrados ?? "—" },
      { icon: Percent, label: "Tasa de conversión", value: kpis ? `${kpis.tasaConversion}%` : "—" },
    ],
    [kpis]
  );

  return (
    <div className="min-h-screen bg-base-950 pb-20">
      <header className="border-b border-white/10 bg-base-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/contacts/export"
              className="focus-ring flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" /> Exportar CSV
            </a>
            <button
              onClick={logout}
              className="focus-ring flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Panel de contactos</h1>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kpiCards.map((k) => (
            <div key={k.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <k.icon className="mb-2 h-4 w-4 text-brand-cyan" />
              <p className="text-lg font-bold text-white">{k.value}</p>
              <p className="text-[11px] text-slate-500">{k.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por restaurante, nombre o teléfono"
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContactStatus | "all")}
              className="focus-ring rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s} className="bg-base-900">
                  {s === "all" ? "Todos los estados" : CONTACT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortAsc((v) => !v)}
              className="focus-ring flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300"
            >
              <ArrowUpDown className="h-3.5 w-3.5" /> {sortAsc ? "Más antiguos" : "Más recientes"}
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Restaurante</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Cargando contactos...
                  </td>
                </tr>
              )}
              {!loading && contacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No se encontraron contactos con estos filtros.
                  </td>
                </tr>
              )}
              {!loading &&
                contacts.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="cursor-pointer transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3.5 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-white">{c.restaurantName}</td>
                    <td className="px-4 py-3.5 text-slate-300">{c.fullName}</td>
                    <td className="px-4 py-3.5 text-slate-400">{c.phone}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          STATUS_COLORS[c.status]
                        )}
                      >
                        {CONTACT_STATUS_LABELS[c.status]}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>

      <ContactDrawer
        contact={selected}
        onClose={() => setSelected(null)}
        onUpdated={(updated) => {
          setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          setSelected(updated);
        }}
      />
    </div>
  );
}
