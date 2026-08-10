import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapProposalRow } from "@/lib/crm/mappers";
import { getCurrentProfile } from "@/lib/crm/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");

    let query = supabase.from("proposals").select("*, company:companies(name)").order("created_at", { ascending: false });
    if (status && status !== "all") query = query.eq("status", status);
    if (companyId) query = query.eq("company_id", companyId);

    const { data, error } = await query;
    if (error) {
      console.error("Error listando propuestas:", error);
      return NextResponse.json({ ok: false, error: "No pudimos cargar las propuestas." }, { status: 500 });
    }

    const proposals = (data || []).map((row: any) => ({ ...mapProposalRow(row), companyName: row.company?.name || null }));
    return NextResponse.json({ ok: true, proposals });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/proposals:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.companyId || !body.planName) {
      return NextResponse.json({ ok: false, error: "Faltan datos obligatorios." }, { status: 400 });
    }

    const profile = await getCurrentProfile();
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("proposals")
      .insert({
        company_id: body.companyId,
        plan_name: body.planName,
        setup_fee: body.setupFee || 0,
        monthly_fee: body.monthlyFee || 0,
        currency: body.currency || "ARS",
        services: body.services || [],
        sent_date: body.sentDate || null,
        expiry_date: body.expiryDate || null,
        assigned_to: body.assignedTo || profile?.id || null,
        status: body.status || "borrador",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando propuesta:", error);
      return NextResponse.json({ ok: false, error: "No pudimos crear la propuesta." }, { status: 500 });
    }

    if (body.status === "enviada" || !body.status) {
      await supabase.from("activities").insert({
        company_id: body.companyId,
        type: "propuesta_enviada",
        content: `${profile?.fullName || "El equipo"} envió la propuesta "${body.planName}" ($${(body.monthlyFee || 0).toLocaleString("es-AR")}/mes).`,
        created_by: profile?.id || null,
      });
      await supabase.from("companies").update({ status: "propuesta" }).eq("id", body.companyId).in("status", [
        "nuevo",
        "contactar",
        "contactado",
        "visita_agendada",
        "visitado",
        "interesado",
        "demo",
      ]);
    }

    return NextResponse.json({ ok: true, proposal: mapProposalRow(data) });
  } catch (err) {
    console.error("Error inesperado en POST /api/admin/proposals:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
