"use server";

import { redirect } from "next/navigation";
import { DELETE_CONFIRMATION } from "@/lib/privacy/constants";
import {
  deleteUserAccountData,
} from "@/lib/privacy/delete-account";
import { hasServiceRoleKey } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ActionFailure = {
  success: false;
  error: string;
};

export async function deleteUserAccount(input: {
  confirmation: string;
  password: string;
}): Promise<ActionFailure | { success: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  if (input.confirmation.trim() !== DELETE_CONFIRMATION) {
    return {
      success: false,
      error: `Saisissez ${DELETE_CONFIRMATION} pour confirmer.`,
    };
  }

  if (!input.password.trim()) {
    return { success: false, error: "Saisissez votre mot de passe." };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: input.password,
  });

  if (verifyError) {
    return { success: false, error: "Mot de passe incorrect." };
  }

  if (!hasServiceRoleKey()) {
    return {
      success: false,
      error: "La suppression de compte n'est pas configurée sur ce serveur. Veuillez contacter le support.",
    };
  }

  try {
    await deleteUserAccountData(user.id);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "La suppression a échoué.",
    };
  }

  await supabase.auth.signOut();
  redirect("/account-deleted");
}

export async function getDeleteAccountAvailability(): Promise<{ available: boolean }> {
  return { available: hasServiceRoleKey() };
}
