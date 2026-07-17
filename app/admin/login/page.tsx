"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || "No pudimos iniciar sesión.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div className="absolute inset-0 -z-10 grid-overlay" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-radial-glow blur-3xl" />

      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl glass-strong p-8 shadow-card">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-1 text-center text-lg font-bold text-white">Acceso interno</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Panel de contactos y diagnósticos</p>

        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
          Contraseña
        </label>
        <div className="relative mb-4">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand-blue"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}
