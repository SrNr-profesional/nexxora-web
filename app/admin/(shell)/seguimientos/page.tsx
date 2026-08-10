"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Phone } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Company, Profile } from "@/lib/crm/types";
import { NEXT_ACTION_LABELS, TASK_TYPES_ICON } from "@/lib/crm/constants";
import { cn } from "@/lib/utils";

export default function SeguimientosPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/companies?pageSize=500").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
    ]).then(([companiesRes, profilesRes]) => {
      if (companiesRes.ok) setCompanies(companiesRes.companies.filter((c: Company) => !c.archived && c.status !== "cliente" && c.status !== "perdido"));
      if (profilesRes.ok) setProfiles(profilesRes.profiles);
      setLoading(false);
    });
  }, []);

  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "Sin asignar";
  const today = new Date().toISOString().slice(0, 10);

  const withFollowUp = companies.filter((c) => c.nextActionDate).sort((a, b) => (a.nextActionDate! < b.nextActionDate! ? -1 : 1));
  const withoutFollowUp = companies.filter((c) => !c.nextActionDate);

  return (
    <div className="mx-auto max-w-3xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Seguimientos</h1>
        <p className="text-sm text-slate-500">La cola de próximas acciones de todos los prospectos activos.</p>
      </div>

      {loading ? (
        <SkeletonRows rows={6} />
      ) : (
        <div className="space-y-6">
          {withoutFollowUp.length > 0 && (
            <div className="rounded-xl2 border border-red-500/20 bg-red-500/5 p-4">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-red-400">
                <AlertTriangle className="h-4 w-4" /> Sin próxima acción ({withoutFollowUp.length})
              </p>
              <div className="space-y-2">
                {withoutFollowUp.map((c) => (
                  <Link key={c.id} href={`/admin/empresas/${c.id}`} className="focus-ring flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm hover:border-red-500/30">
                    <span className="text-slate-200">{c.name}</span>
                    <StatusBadge status={c.status} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {withFollowUp.length === 0 && withoutFollowUp.length === 0 ? (
            <EmptyState icon={Phone} title="No hay seguimientos pendientes" />
          ) : (
            <div className="space-y-2">
              {withFollowUp.map((c) => {
                const overdue = c.nextActionDate! < today;
                return (
                  <Link
                    key={c.id}
                    href={`/admin/empresas/${c.id}`}
                    className={cn(
                      "focus-ring flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors",
                      overdue ? "border-amber-500/30 bg-amber-500/5" : "border-white/10 bg-white/[0.03]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{c.nextActionType ? TASK_TYPES_ICON[c.nextActionType] : "•"}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <p className="text-xs text-slate-500">
                          {c.nextActionType && NEXT_ACTION_LABELS[c.nextActionType]} · {profileName(c.nextActionAssignedTo || c.assignedTo)}
                        </p>
                      </div>
                    </div>
                    <span className={cn("flex-shrink-0 text-xs font-semibold", overdue ? "text-amber-400" : "text-slate-500")}>
                      {new Date(c.nextActionDate! + "T00:00:00").toLocaleDateString("es-AR")}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
