import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  mapActivityRow,
  mapCompanyRow,
  mapImplementationItemRow,
  mapPersonRow,
  mapProposalRow,
} from "@/lib/crm/mappers";
import { getCurrentProfile } from "@/lib/crm/session";
import { IMPLEMENTATION_TEMPLATE } from "@/lib/crm/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAdminClient();

    const [{ data: company, error }, { data: people }, { data: activities }, { data: proposals }, { data: items }] =
      await Promise.all([
        supabase.from("companies").select("*").eq("id", params.id).single(),
        supabase.from("people").select("*").eq("company_id", params.id).order("is_primary", { ascending: false }),
        supabase.from("activities").select("*").eq("company_id", params.id).order("created_at", { ascending: false }),
        supabase.from("proposals").select("*").eq("company_id", params.id).order("created_at", { ascending: false }),
        supabase.from("implementation_items").select("*").eq("company_id", params.id).order("sort_order"),
      ]);

    if (error || !company) {
      return NextResponse.json({ ok: false, error: "Prospecto no encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      company: {
        ...mapCompanyRow(company),
        people: (people || []).map(mapPersonRow),
        activities: (activities || []).map(mapActivityRow),
        proposals: (proposals || []).map(mapProposalRow),
        implementationItems: (items || []).map(mapImplementationItemRow),
      },
    });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/companies/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

const UPDATABLE_FIELDS: Record<string, string> = {
  name: "name",
  legalName: "legal_name",
  industry: "industry",
  subcategory: "subcategory",
  address: "address",
  city: "city",
  province: "province",
  mapsUrl: "maps_url",
  website: "website",
  instagram: "instagram",
  facebook: "facebook",
  email: "email",
  phone: "phone",
  whatsapp: "whatsapp",
  employeesEstimate: "employees_estimate",
  branchesCount: "branches_count",
  sizeEstimate: "size_estimate",
  notes: "notes",
  status: "status",
  priority: "priority",
  painPoints: "pain_points",
  mrrPotential: "mrr_potential",
  mrrActual: "mrr_actual",
  setupFeeActual: "setup_fee_actual",
  nextActionType: "next_action_type",
  nextActionDate: "next_action_date",
  nextActionTime: "next_action_time",
  nextActionComment: "next_action_comment",
  nextActionAssignedTo: "next_action_assigned_to",
  lostReasonId: "lost_reason_id",
  lostComment: "lost_comment",
  assignedTo: "assigned_to",
  clientSince: "client_since",
  nextRenewalDate: "next_renewal_date",
  archived: "archived",
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdminClient();
    const profile = await getCurrentProfile();

    const { data: before } = await supabase.from("companies").select("status").eq("id", params.id).single();

    const update: Record<string, any> = {};
    for (const [key, column] of Object.entries(UPDATABLE_FIELDS)) {
      if (body[key] !== undefined) update[column] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: false, error: "Nada para actualizar." }, { status: 400 });
    }

    const { data, error } = await supabase.from("companies").update(update).eq("id", params.id).select().single();

    if (error) {
      console.error("Error actualizando empresa:", error);
      return NextResponse.json({ ok: false, error: "No pudimos actualizar el prospecto." }, { status: 500 });
    }

    // Timeline automático de cambio de estado (punto 15).
    if (body.status && before && before.status !== body.status) {
      await supabase.from("activities").insert({
        company_id: params.id,
        type: "cambio_estado",
        content: `Estado cambiado por ${profile?.fullName || "el equipo"}: ${before.status} → ${body.status}`,
        created_by: profile?.id || null,
      });

      // Al convertir en cliente, sembrar el checklist de implementación (punto 27).
      if (body.status === "cliente") {
        await supabase.from("companies").update({ client_since: new Date().toISOString().slice(0, 10) }).eq("id", params.id);
        const { data: existingItems } = await supabase
          .from("implementation_items")
          .select("id")
          .eq("company_id", params.id)
          .limit(1);
        if (!existingItems || existingItems.length === 0) {
          await supabase.from("implementation_items").insert(
            IMPLEMENTATION_TEMPLATE.map((label, i) => ({ company_id: params.id, label, sort_order: i }))
          );
        }
      }
    }

    return NextResponse.json({ ok: true, company: mapCompanyRow(data) });
  } catch (err) {
    console.error("Error inesperado en PATCH /api/admin/companies/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

// No hay DELETE real: se archiva (punto 45 — nunca se borra información por error).
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("companies").update({ archived: true }).eq("id", params.id);
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos archivar el prospecto." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error inesperado en DELETE /api/admin/companies/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
