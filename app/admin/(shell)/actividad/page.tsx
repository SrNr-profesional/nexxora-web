"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SkeletonRows } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";
import type { Activity, Profile } from "@/lib/crm/types";
import { ACTIVITY_TYPE_LABELS } from "@/lib/crm/constants";
import { Activity as ActivityIcon } from "lucide-react";

interface FeedActivity extends Activity {
  companyName: string | null;
}

const TYPE_ICON: Record<string, string> = {
  nota: "📝",
  llamada: "📞",
  whatsapp: "💬",
  visita: "🚗",
  reunion: "🤝",
  demo: "🖥",
  cambio_estado: "🔀",
  propuesta_enviada: "📄",
  cierre: "🎉",
  tarea_completada: "✅",
};

export default function ActividadPage() {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/activities").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
    ]).then(([activitiesRes, profilesRes]) => {
      if (activitiesRes.ok) setActivities(activitiesRes.activities);
      if (profilesRes.ok) setProfiles(profilesRes.profiles);
      setLoading(false);
    });
  }, []);

  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "Alguien";

  return (
    <div className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Actividad del equipo</h1>
        <p className="text-sm text-slate-500">Todo lo que va pasando en Nexxora, en orden.</p>
      </div>

      {loading ? (
        <SkeletonRows rows={8} />
      ) : activities.length === 0 ? (
        <EmptyState icon={ActivityIcon} title="Todavía no hay actividad" />
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="mt-0.5 flex-shrink-0 text-lg">{TYPE_ICON[a.type] || "•"}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-200">
                  <span className="font-semibold text-white">{profileName(a.createdBy)}</span>{" "}
                  {ACTIVITY_TYPE_LABELS[a.type].toLowerCase()}
                  {a.companyName && (
                    <>
                      {" "}en{" "}
                      <Link href={`/admin/empresas/${a.companyId}`} className="focus-ring font-medium text-brand-cyan hover:underline">
                        {a.companyName}
                      </Link>
                    </>
                  )}
                  : {a.content}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">{new Date(a.createdAt).toLocaleString("es-AR")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
