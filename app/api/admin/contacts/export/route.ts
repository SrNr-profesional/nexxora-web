import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapContactRow } from "@/lib/mapContact";

export const runtime = "nodejs";

function csvEscape(value: unknown) {
  const str = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: "No pudimos exportar los contactos." }, { status: 500 });
    }

    const contacts = (data || []).map(mapContactRow);

    const headers = [
      "Fecha",
      "Nombre",
      "Cargo",
      "Restaurante",
      "Ciudad",
      "Teléfono",
      "Email",
      "Instagram",
      "Sucursales",
      "Pedidos diarios",
      "Empleados",
      "Tipo de negocio",
      "Canales de pedidos",
      "Sistema actual",
      "Problemas",
      "Principal problema",
      "Funciones deseadas",
      "Urgencia",
      "Mejor horario",
      "Preferencia de contacto",
      "Comentarios",
      "Estado",
      "Notas internas",
      "Próximo seguimiento",
    ];

    const rows = contacts.map((c) =>
      [
        c.createdAt,
        c.fullName,
        c.role,
        c.restaurantName,
        c.city,
        c.phone,
        c.email,
        c.instagram,
        c.branchesCount,
        c.dailyOrders,
        c.employeesCount,
        c.businessType,
        c.orderChannels,
        c.currentSystem,
        c.problems,
        c.mainProblem,
        c.desiredFeatures,
        c.urgency,
        c.bestContactTime,
        c.contactPreference,
        c.extraComments,
        c.status,
        c.internalNotes,
        c.nextFollowUpDate,
      ]
        .map(csvEscape)
        .join(",")
    );

    const csv = [headers.map(csvEscape).join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nexxora-contactos-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("Error inesperado en export:", err);
    return NextResponse.json({ ok: false, error: "Error inesperado." }, { status: 500 });
  }
}
