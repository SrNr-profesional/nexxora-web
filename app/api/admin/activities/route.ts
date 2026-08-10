import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapActivityRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Feed de actividad del equipo, con el nombre de la empresa incluido (join).
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 60;

    const { data, error } = await supabase
      .from("activities")
      .select("*, company:companies(name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error listando actividad:", error);
      return NextResponse.json({ ok: false, error: "No pudimos cargar la actividad." }, { status: 500 });
    }

    const activities = (data || []).map((row: any) => ({
      ...mapActivityRow(row),
      companyName: row.company?.name || null,
    }));

    return NextResponse.json({ ok: true, activities });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/activities:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
