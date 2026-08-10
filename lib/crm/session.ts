import "server-only";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { mapProfileRow } from "./mappers";
import type { Profile } from "./types";

/** Perfil del usuario logueado (Nara/Juli), para atribuir acciones. Server-only. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = getSupabaseAdminClient();
  const { data } = await admin.from("profiles").select("*").eq("id", user.id).single();
  return data ? mapProfileRow(data) : null;
}
