import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapTaskRow } from "@/lib/crm/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS: Record<string, string> = {
  title: "title",
  description: "description",
  companyId: "company_id",
  assignedTo: "assigned_to",
  priority: "priority",
  dueDate: "due_date",
  dueTime: "due_time",
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
    if (body.status === "completada") update.completed_at = new Date().toISOString();

    const { data, error } = await supabase.from("tasks").update(update).eq("id", params.id).select().single();
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos actualizar la tarea." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, task: mapTaskRow(data) });
  } catch (err) {
    console.error("Error inesperado en PATCH /api/admin/tasks/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("tasks").update({ status: "cancelada" }).eq("id", params.id);
    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos cancelar la tarea." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error inesperado en DELETE /api/admin/tasks/[id]:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
