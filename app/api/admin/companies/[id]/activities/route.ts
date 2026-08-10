import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapActivityRow } from "@/lib/crm/mappers";
import { getCurrentProfile } from "@/lib/crm/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.type || !body.content) {
      return NextResponse.json({ ok: false, error: "Faltan datos (tipo, contenido)." }, { status: 400 });
    }

    const profile = await getCurrentProfile();
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("activities")
      .insert({
        company_id: params.id,
        type: body.type,
        content: body.content,
        metadata: body.metadata || {},
        created_by: profile?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando actividad:", error);
      return NextResponse.json({ ok: false, error: "No pudimos guardar la actividad." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, activity: mapActivityRow(data) });
  } catch (err) {
    console.error("Error inesperado en POST /api/admin/companies/[id]/activities:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
