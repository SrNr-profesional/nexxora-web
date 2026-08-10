import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapFeatureRequestRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("feature_requests").select("*").order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos cargar las funcionalidades pedidas." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, featureRequests: (data || []).map(mapFeatureRequestRow) });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/feature-requests:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.feature) {
      return NextResponse.json({ ok: false, error: "Falta la funcionalidad." }, { status: 400 });
    }
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("feature_requests")
      .insert({ company_id: body.companyId || null, feature: body.feature })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos guardar el pedido." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, featureRequest: mapFeatureRequestRow(data) });
  } catch (err) {
    console.error("Error inesperado en POST /api/admin/feature-requests:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
