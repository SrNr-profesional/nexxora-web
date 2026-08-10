import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapPersonRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS: Record<string, string> = {
  firstName: "first_name",
  lastName: "last_name",
  position: "position",
  phone: "phone",
  whatsapp: "whatsapp",
  email: "email",
  bestContactTime: "best_contact_time",
  decisionLevel: "decision_level",
  isPrimary: "is_primary",
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdminClient();

    const update: Record<string, any> = {};
    for (const [key, column] of Object.entries(FIELDS)) {
      if (body[key] !== undefined) update[column] = body[key];
    }

    const { data, error } = await supabase.from("people").update(update).eq("id", params.id).select().single();
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos actualizar el contacto." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, person: mapPersonRow(data) });
  } catch (err) {
    console.error("Error inesperado en PATCH /api/admin/people/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("people").delete().eq("id", params.id);
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos eliminar el contacto." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error inesperado en DELETE /api/admin/people/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
