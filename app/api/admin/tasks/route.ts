import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapTaskRow } from "@/lib/crm/mappers";
import { getCurrentProfile } from "@/lib/crm/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(req.url);
    const assignedTo = searchParams.get("assignedTo");
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");
    const dueBefore = searchParams.get("dueBefore");

    let query = supabase.from("tasks").select("*").order("due_date", { ascending: true, nullsFirst: false });

    if (assignedTo && assignedTo !== "all") query = query.eq("assigned_to", assignedTo);
    if (status && status !== "all") query = query.eq("status", status);
    if (companyId) query = query.eq("company_id", companyId);
    if (dueBefore) query = query.lte("due_date", dueBefore);

    const { data, error } = await query;
    if (error) {
      console.error("Error listando tareas:", error);
      return NextResponse.json({ ok: false, error: "No pudimos cargar las tareas." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, tasks: (data || []).map(mapTaskRow) });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/tasks:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ ok: false, error: "Falta el título de la tarea." }, { status: 400 });
    }

    const profile = await getCurrentProfile();
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: body.title,
        description: body.description || null,
        company_id: body.companyId || null,
        assigned_to: body.assignedTo || profile?.id || null,
        created_by: profile?.id || null,
        priority: body.priority || "B",
        due_date: body.dueDate || null,
        due_time: body.dueTime || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando tarea:", error);
      return NextResponse.json({ ok: false, error: "No pudimos crear la tarea." }, { status: 500 });
    }

    // Si se la asigna a otro socio, se notifica (punto 21).
    if (body.assignedTo && profile && body.assignedTo !== profile.id) {
      await supabase.from("notifications").insert({
        profile_id: body.assignedTo,
        type: "tarea_asignada",
        content: `${profile.fullName} te asignó una tarea: "${body.title}".`,
      });
    }

    return NextResponse.json({ ok: true, task: mapTaskRow(data) });
  } catch (err) {
    console.error("Error inesperado en POST /api/admin/tasks:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
