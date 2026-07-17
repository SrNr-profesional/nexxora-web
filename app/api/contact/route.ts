import { NextRequest, NextResponse } from "next/server";
import { diagnosticSchema } from "@/lib/validations";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { sendAdminNotification, sendClientConfirmation } from "@/lib/resend";

export const runtime = "nodejs";

// Antispam simple: máximo 5 envíos cada 10 minutos por IP (best-effort, sin estado persistente entre instancias).
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Demasiados intentos. Probá nuevamente en unos minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = diagnosticSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Revisá los datos del formulario e intentá nuevamente." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot: si el campo "website" viene completo, es un bot.
    if (data.website) {
      return NextResponse.json({ ok: true }); // respondemos ok para no delatar el honeypot
    }

    const supabase = getSupabaseAdminClient();

    // Evitar envíos duplicados: mismo teléfono o email en los últimos 5 minutos.
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentDuplicates } = await supabase
      .from("contacts")
      .select("id")
      .or(`phone.eq.${data.phone},email.eq.${data.email}`)
      .gte("created_at", fiveMinAgo)
      .limit(1);

    if (recentDuplicates && recentDuplicates.length > 0) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const { error: insertError } = await supabase.from("contacts").insert({
      full_name: data.fullName,
      role: data.role,
      restaurant_name: data.restaurantName,
      city: data.city,
      phone: data.phone,
      email: data.email,
      instagram: data.instagram || null,
      branches_count: data.branchesCount,
      daily_orders: data.dailyOrders,
      employees_count: data.employeesCount,
      business_type: data.businessType,
      order_channels: data.orderChannels,
      current_system: data.currentSystem,
      problems: data.problems,
      main_problem: data.mainProblem,
      desired_features: data.desiredFeatures,
      urgency: data.urgency,
      best_contact_time: data.bestContactTime,
      contact_preference: data.contactPreference,
      extra_comments: data.extraComments || null,
      accepts_privacy_policy: data.acceptsPrivacyPolicy,
      source: data.source || null,
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
      utm_term: data.utmTerm || null,
      utm_content: data.utmContent || null,
      status: "nuevo",
    });

    if (insertError) {
      console.error("Error insertando contacto en Supabase:", insertError);
      return NextResponse.json(
        { ok: false, error: "No pudimos guardar tu diagnóstico. Intentá nuevamente en unos minutos." },
        { status: 500 }
      );
    }

    // Envío de emails: no bloquea la respuesta si falla (se loguea el error).
    const emailResults = await Promise.allSettled([
      sendAdminNotification(data),
      sendClientConfirmation(data),
    ]);
    emailResults.forEach((r) => {
      if (r.status === "rejected") console.error("Error enviando email:", r.reason);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error inesperado en /api/contact:", err);
    return NextResponse.json(
      { ok: false, error: "Ocurrió un error inesperado. Probá de nuevo en unos minutos." },
      { status: 500 }
    );
  }
}
