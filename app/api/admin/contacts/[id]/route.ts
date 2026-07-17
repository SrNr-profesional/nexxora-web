import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapContactRow } from "@/lib/mapContact";
import { CONTACT_STATUS_LABELS } from "@/types/contact";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdminClient();

    const update: Record<string, any> = {};
    if (body.status && body.status in CONTACT_STATUS_LABELS) update.status = body.status;
    if (typeof body.internalNotes === "string") update.internal_notes = body.internalNotes;
    if (body.nextFollowUpDate !== undefined) update.next_follow_up_date = body.nextFollowUpDate || null;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: false, error: "Nada para actualizar." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contacts")
      .update(update)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error actualizando contacto:", error);
      return NextResponse.json({ ok: false, error: "No pudimos actualizar el contacto." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, contact: mapContactRow(data) });
  } catch (err) {
    console.error("Error inesperado en PATCH /api/admin/contacts/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
