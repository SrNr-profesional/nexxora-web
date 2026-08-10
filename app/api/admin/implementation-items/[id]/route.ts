import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapImplementationItemRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("implementation_items")
      .update({ done: !!body.done })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos actualizar el ítem." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, item: mapImplementationItemRow(data) });
  } catch (err) {
    console.error("Error inesperado en PATCH /api/admin/implementation-items/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
