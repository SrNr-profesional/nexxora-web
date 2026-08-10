import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapPersonRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.firstName) {
      return NextResponse.json({ ok: false, error: "Falta el nombre del contacto." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    if (body.isPrimary) {
      await supabase.from("people").update({ is_primary: false }).eq("company_id", params.id);
    }

    const { data, error } = await supabase
      .from("people")
      .insert({
        company_id: params.id,
        first_name: body.firstName,
        last_name: body.lastName || null,
        position: body.position || "otro",
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        best_contact_time: body.bestContactTime || null,
        decision_level: body.decisionLevel || "usuario",
        is_primary: !!body.isPrimary,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando contacto:", error);
      return NextResponse.json({ ok: false, error: "No pudimos guardar el contacto." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, person: mapPersonRow(data) });
  } catch (err) {
    console.error("Error inesperado en POST /api/admin/companies/[id]/people:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
