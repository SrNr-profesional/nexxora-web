import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapNotificationRow } from "@/lib/crm/mappers";
import { getCurrentProfile } from "@/lib/crm/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos cargar las notificaciones." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, notifications: (data || []).map(mapNotificationRow) });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/notifications:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });

    const supabase = getSupabaseAdminClient();
    await supabase.from("notifications").update({ read: true }).eq("profile_id", profile.id).eq("read", false);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error inesperado en PATCH /api/admin/notifications:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
