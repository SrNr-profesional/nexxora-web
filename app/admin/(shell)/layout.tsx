import { redirect } from "next/navigation";
import { getSupabaseServerClient, getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapProfileRow } from "@/lib/crm/mappers";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import MobileTabBar from "@/components/admin/MobileTabBar";

export const dynamic = "force-dynamic";

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El middleware ya protege estas rutas; esto es una segunda barrera defensiva.
  if (!user) {
    redirect("/admin/login");
  }

  const adminClient = getSupabaseAdminClient();
  const { data: profileRow } = await adminClient.from("profiles").select("*").eq("id", user.id).single();

  const profile = profileRow
    ? mapProfileRow(profileRow)
    : {
        id: user.id,
        fullName: user.email?.split("@")[0] ?? "Usuario",
        email: user.email ?? "",
        avatarColor: "#22d3ee",
        role: "socio" as const,
        createdAt: new Date().toISOString(),
      };

  return (
    <div className="flex min-h-screen bg-base-950">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar profile={profile} />
        <main className="flex-1">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
