import "server-only";
import { createClient } from "@supabase/supabase-js";

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
