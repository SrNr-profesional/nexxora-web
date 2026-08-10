import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapProposalRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS: Record<string, string> = {
  planName: "plan_name",
  setupFee: "setup_fee",
  monthlyFee: "monthly_fee",
  currency: "currency",
  services: "services",
  sentDate: "sent_date",
  expiryDate: "expiry_date",
  assignedTo: "assigned_to",
  status: "status",
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdminClient();

    const update: Record<string, any> = {};
    for (const [key, column] of Object.entries(FIELDS)) {
      if (body[key] !== undefined) update[column] = body[key];
    }

    const { data, error } = await supabase.from("proposals").update(update).eq("id", params.id).select().single();
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos actualizar la propuesta." }, { status: 500 });
    }

    if (body.status === "aceptada") {
      await supabase.from("companies").update({ status: "cliente" }).eq("id", data.company_id);
      await supabase.from("activities").insert({
        company_id: data.company_id,
        type: "cierre",
        content: `Propuesta "${data.plan_name}" aceptada. Cliente cerrado.`,
      });
    }

    return NextResponse.json({ ok: true, proposal: mapProposalRow(data) });
  } catch (err) {
    console.error("Error inesperado en PATCH /api/admin/proposals/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
