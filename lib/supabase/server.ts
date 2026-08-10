import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para uso EXCLUSIVO en el servidor (API routes, server actions).
 * Usa la Service Role Key, que tiene permisos totales y jamás debe exponerse al navegador.
 * Nunca importar este archivo desde un componente cliente ("use client").
 */
export function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan variables de entorno de Supabase (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). Revisá tu .env.local."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cliente de Supabase con la sesión del usuario logueado (Supabase Auth),
 * usando la Anon Key (segura de exponer: RLS no tiene policies, así que
 * por sí sola no puede leer/escribir nada — solo sirve para el flujo de
 * login/sesión). Para uso en Route Handlers y Server Components de /admin.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Revisá tu .env.local."
    );
  }

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Llamado desde un Server Component (no puede escribir cookies);
          // el middleware se encarga de refrescar la sesión en ese caso.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Ver comentario arriba.
        }
      },
    },
  });
}
