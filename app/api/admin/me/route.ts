import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/crm/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  return NextResponse.json({ ok: true, profile });
}
