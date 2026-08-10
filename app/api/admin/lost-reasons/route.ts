import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapLostReasonRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("lost_reasons").select("*").order("sort_order");
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos cargar los motivos." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, lostReasons: (data || []).map(mapLostReasonRow) });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/lost-reasons:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
