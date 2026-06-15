import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, hasPublicEnv } from "@/lib/env/public";

export function hasServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export function createAdminClient() {
  if (!hasPublicEnv()) {
    throw new Error("Missing Supabase public environment variables.");
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Required for account deletion only — set server-side in Vercel.",
    );
  }

  const { supabaseUrl } = getPublicEnv();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
