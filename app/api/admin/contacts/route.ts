import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapContactRow } from "@/lib/mapContact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") === "asc" ? true : false;

    let query = supabase.from("contacts").select("*").order("created_at", { ascending: sort });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `restaurant_name.ilike.%${search}%,full_name.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error listando contactos:", error);
      return NextResponse.json({ ok: false, error: "No pudimos cargar los contactos." }, { status: 500 });
    }

    const contacts = (data || []).map(mapContactRow);

    const kpis = {
      total: contacts.length,
      nuevos: contacts.filter((c) => c.status === "nuevo").length,
      reunionesAgendadas: contacts.filter((c) => c.status === "reunion_agendada").length,
      propuestasEnviadas: contacts.filter((c) => c.status === "propuesta_enviada").length,
      clientesCerrados: contacts.filter((c) => c.status === "cliente_cerrado").length,
      tasaConversion:
        contacts.length > 0
          ? Math.round((contacts.filter((c) => c.status === "cliente_cerrado").length / contacts.length) * 100)
          : 0,
    };

    return NextResponse.json({ ok: true, contacts, kpis });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/contacts:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
