import { buildUserDataExport } from "@/lib/privacy/export";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return new Response("Non autorisé", { status: 401 });
  }

  try {
    const { filename, data } = await buildUserDataExport(
      supabase,
      user.id,
      user.email,
      user.created_at ?? null,
    );

    return new Response(data, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "L'exportation a échoué.";
    return new Response(message, { status: 500 });
  }
}
