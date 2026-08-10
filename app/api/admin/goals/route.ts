import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapGoalRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(req.url);
    const periodMonth = searchParams.get("periodMonth");

    let query = supabase.from("goals").select("*");
    if (periodMonth) query = query.eq("period_month", periodMonth);

    const { data, error } = await query;
    if (error) {
      console.error("Error listando metas:", error);
      return NextResponse.json({ ok: false, error: "No pudimos cargar las metas." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, goals: (data || []).map(mapGoalRow) });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/goals:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.periodMonth || !body.metric || body.target === undefined) {
      return NextResponse.json({ ok: false, error: "Faltan datos obligatorios." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("goals")
      .upsert(
        {
          profile_id: body.profileId || null,
          period_month: body.periodMonth,
          metric: body.metric,
          target: body.target,
        },
        { onConflict: "profile_id,period_month,metric" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error guardando meta:", error);
      return NextResponse.json({ ok: false, error: "No pudimos guardar la meta." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, goal: mapGoalRow(data) });
  } catch (err) {
    console.error("Error inesperado en POST /api/admin/goals:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
