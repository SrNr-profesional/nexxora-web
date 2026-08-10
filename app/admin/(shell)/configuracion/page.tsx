"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import type { LostReason, Profile } from "@/lib/crm/types";

export default function ConfiguracionPage() {
  const [me, setMe] = useState<Profile | null>(null);
  const [team, setTeam] = useState<Profile[]>([]);
  const [lostReasons, setLostReasons] = useState<LostReason[]>([]);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/me").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
      fetch("/api/admin/lost-reasons").then((r) => r.json()),
    ]).then(([meRes, teamRes, lostRes]) => {
      if (meRes.ok) setMe(meRes.profile);
      if (teamRes.ok) setTeam(teamRes.profiles);
      if (lostRes.ok) setLostReasons(lostRes.lostReasons);
    });
  }, []);

  const changePassword = async () => {
    if (password.length < 8) {
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(data.ok ? "Contraseña actualizada ✓" : data.error);
    if (data.ok) setPassword("");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-sm text-slate-500">Tu cuenta, el equipo y los catálogos del sistema.</p>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-white">Mi perfil</h2>
        {me && (
          <div className="mb-5 flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: me.avatarColor }}
            >
              {me.fullName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{me.fullName}</p>
              <p className="text-xs text-slate-500">{me.email} · {me.role}</p>
            </div>
          </div>
        )}

        <label className="mb-1.5 block text-xs font-medium text-slate-400">Cambiar contraseña</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña (mín. 8 caracteres)"
            className="focus-ring flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
          />
          <Button onClick={changePassword} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
          </Button>
        </div>
        {message && <p className="mt-2 text-xs text-slate-400">{message}</p>}
      </div>

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-white">Equipo Nexxora</h2>
        <div className="space-y-2.5">
          {team.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: p.avatarColor }}
              >
                {p.fullName.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{p.fullName}</p>
                <p className="text-xs text-slate-500">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-600">
          Para agregar más integrantes al equipo (vendedores, SDR, soporte), creá el usuario desde el Dashboard de Supabase
          (Authentication → Users) — el perfil se genera solo.
        </p>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-white">Motivos de pérdida</h2>
        <div className="flex flex-wrap gap-2">
          {lostReasons.map((r) => (
            <span key={r.id} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300">
              {r.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
