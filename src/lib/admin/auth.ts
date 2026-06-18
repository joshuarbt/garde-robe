import type { User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function isAdmin(user: User): boolean {
  if (user.app_metadata?.role === "admin") {
    return true;
  }

  const allowlist =
    process.env.ADMIN_USER_IDS?.split(",")
      .map((entry) => entry.trim())
      .filter(Boolean) ?? [];

  return allowlist.includes(user.id);
}

export async function requireAdmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    notFound();
  }

  return user;
}
