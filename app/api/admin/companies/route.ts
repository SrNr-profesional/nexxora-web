import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapCompanyRow } from "@/lib/crm/mappers";
import { getCurrentProfile } from "@/lib/crm/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const industry = searchParams.get("industry");
    const priority = searchParams.get("priority");
    const assignedTo = searchParams.get("assignedTo");
    const city = searchParams.get("city");
    const source = searchParams.get("source");
    const withoutFollowUp = searchParams.get("withoutFollowUp") === "true";
    const overdue = searchParams.get("overdue") === "true";
    const includeArchived = searchParams.get("includeArchived") === "true";
    const sort = searchParams.get("sort") || "created_at";
    const sortAsc = searchParams.get("sortDir") === "asc";
    const pageSize = Number(searchParams.get("pageSize")) || undefined;

    let query = supabase.from("companies").select("*").order(sort, { ascending: sortAsc });

    if (!includeArchived) query = query.eq("archived", false);
    if (status && status !== "all") query = query.eq("status", status);
    if (industry && industry !== "all") query = query.eq("industry", industry);
    if (priority && priority !== "all") query = query.eq("priority", priority);
    if (assignedTo && assignedTo !== "all") query = query.eq("assigned_to", assignedTo);
    if (city) query = query.ilike("city", `%${city}%`);
    if (source) query = query.ilike("source", `%${source}%`);
    if (withoutFollowUp) query = query.is("next_action_date", null);
    if (overdue) query = query.lt("next_action_date", new Date().toISOString().slice(0, 10));
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    if (pageSize) query = query.limit(pageSize);

    const { data, error } = await query;

    if (error) {
      console.error("Error listando empresas:", error);
      return NextResponse.json({ ok: false, error: "No pudimos cargar los prospectos." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, companies: (data || []).map(mapCompanyRow) });
  } catch (err) {
    console.error("Error inesperado en GET /api/admin/companies:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.industry) {
      return NextResponse.json({ ok: false, error: "Faltan datos obligatorios (nombre, industria)." }, { status: 400 });
    }

    const profile = await getCurrentProfile();
    const supabase = getSupabaseAdminClient();

    const insert: Record<string, any> = {
      name: body.name,
      legal_name: body.legalName || null,
      industry: body.industry,
      subcategory: body.subcategory || null,
      address: body.address || null,
      city: body.city || null,
      province: body.province || null,
      maps_url: body.mapsUrl || null,
      website: body.website || null,
      instagram: body.instagram || null,
      facebook: body.facebook || null,
      email: body.email || null,
      phone: body.phone || null,
      whatsapp: body.whatsapp || null,
      employees_estimate: body.employeesEstimate || null,
      branches_count: body.branchesCount || null,
      size_estimate: body.sizeEstimate || null,
      notes: body.notes || null,
      status: body.status || "nuevo",
      priority: body.priority || "B",
      pain_points: body.painPoints || [],
      mrr_potential: body.mrrPotential || 0,
      source: body.source || null,
      source_contact_id: body.sourceContactId || null,
      assigned_to: body.assignedTo || profile?.id || null,
      created_by: profile?.id || null,
    };

    const { data, error } = await supabase.from("companies").insert(insert).select().single();

    if (error) {
      console.error("Error creando empresa:", error);
      return NextResponse.json({ ok: false, error: "No pudimos crear el prospecto." }, { status: 500 });
    }

    await supabase.from("activities").insert({
      company_id: data.id,
      type: "nota",
      content: `${profile?.fullName || "Alguien"} agregó este prospecto.`,
      created_by: profile?.id || null,
    });

    return NextResponse.json({ ok: true, company: mapCompanyRow(data) });
  } catch (err) {
    console.error("Error inesperado en POST /api/admin/companies:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
