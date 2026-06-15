import { createAdminClient } from "@/lib/supabase/admin";
import { deleteAllUserStorage } from "@/lib/privacy/storage";

/**
 * Permanently deletes all user data: Storage files, then auth user (DB rows cascade).
 * Uses service role — caller must verify identity first.
 */
export async function deleteUserAccountData(userId: string): Promise<void> {
  const admin = createAdminClient();

  await deleteAllUserStorage(admin, userId);

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);

  if (deleteError) {
    throw new Error(
      "Vos fichiers ont été supprimés, mais nous n'avons pas pu supprimer votre compte. Veuillez contacter le support.",
    );
  }
}
