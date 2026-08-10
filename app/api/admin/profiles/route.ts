import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapProfileRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lista de perfiles del equipo (para selects de "responsable"/"asignar a").
export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("profiles").select("*").order("full_name");
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos cargar el equipo." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, profiles: (data || []).map(mapProfileRow) });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/profiles:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
