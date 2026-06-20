"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  validateAdminEmail,
  validateAdminPassword,
  validateAdminUserId,
} from "@/lib/admin/validation";
import type { AdminActionResult } from "@/lib/admin/types";
import { DELETE_CONFIRMATION } from "@/lib/privacy/constants";
import { deleteUserAccountData } from "@/lib/privacy/delete-account";
import { createAdminClient, hasServiceRoleKey } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function verifyAdminPassword(password: string): Promise<AdminActionResult | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, error: "Session administrateur invalide." };
  }

  if (!password.trim()) {
    return { success: false, error: "Saisissez votre mot de passe." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (error) {
    return { success: false, error: "Mot de passe incorrect." };
  }

  return null;
}

function revalidateAdminUserPaths(userId: string): void {
  revalidatePath("/admin");
  revalidatePath(`/admin/${userId}`);
}

async function getUnconfirmedAdminUser(
  userId: string,
): Promise<
  | { success: true; email: string }
  | { success: false; error: string }
> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: "Utilisateur introuvable." };
  }

  if (data.user.email_confirmed_at) {
    return { success: false, error: "L'e-mail est déjà vérifié." };
  }

  const email = data.user.email?.trim();
  if (!email) {
    return { success: false, error: "Cet utilisateur n'a pas d'adresse e-mail." };
  }

  return { success: true, email };
}

export async function adminResendConfirmationEmail(input: {
  userId: string;
}): Promise<AdminActionResult> {
  await requireAdmin();

  const userIdError = validateAdminUserId(input.userId);
  if (userIdError) {
    return { success: false, error: userIdError };
  }

  if (!hasServiceRoleKey()) {
    return {
      success: false,
      error: "Cette action n'est pas disponible dans cet environnement.",
    };
  }

  const userResult = await getUnconfirmedAdminUser(input.userId);
  if (!userResult.success) {
    return userResult;
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.resend({
    type: "signup",
    email: userResult.email,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateAdminUserPaths(input.userId);
  return { success: true };
}

export async function adminConfirmUserEmail(input: {
  userId: string;
  password: string;
}): Promise<AdminActionResult> {
  await requireAdmin();

  const userIdError = validateAdminUserId(input.userId);
  if (userIdError) {
    return { success: false, error: userIdError };
  }

  const passwordError = await verifyAdminPassword(input.password);
  if (passwordError) {
    return passwordError;
  }

  if (!hasServiceRoleKey()) {
    return {
      success: false,
      error: "Cette action n'est pas disponible dans cet environnement.",
    };
  }

  const userResult = await getUnconfirmedAdminUser(input.userId);
  if (!userResult.success) {
    return userResult;
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    email_confirm: true,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateAdminUserPaths(input.userId);
  return { success: true };
}

export async function adminDeleteUser(input: {
  userId: string;
  confirmation: string;
  password: string;
}): Promise<AdminActionResult> {
  const adminUser = await requireAdmin();

  const userIdError = validateAdminUserId(input.userId);
  if (userIdError) {
    return { success: false, error: userIdError };
  }

  if (input.userId === adminUser.id) {
    return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte." };
  }

  if (input.confirmation.trim() !== DELETE_CONFIRMATION) {
    return {
      success: false,
      error: `Saisissez ${DELETE_CONFIRMATION} pour confirmer.`,
    };
  }

  const passwordError = await verifyAdminPassword(input.password);
  if (passwordError) {
    return passwordError;
  }

  if (!hasServiceRoleKey()) {
    return {
      success: false,
      error: "La suppression de compte n'est pas disponible dans cet environnement.",
    };
  }

  try {
    await deleteUserAccountData(input.userId);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de supprimer l'utilisateur.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function adminUpdateEmail(input: {
  userId: string;
  email: string;
  password: string;
}): Promise<AdminActionResult> {
  await requireAdmin();

  const userIdError = validateAdminUserId(input.userId);
  if (userIdError) {
    return { success: false, error: userIdError };
  }

  const emailError = validateAdminEmail(input.email);
  if (emailError) {
    return { success: false, error: emailError };
  }

  const passwordError = await verifyAdminPassword(input.password);
  if (passwordError) {
    return passwordError;
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    email: input.email.trim(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${input.userId}`);
  return { success: true };
}

export async function adminResetPassword(input: {
  userId: string;
  password: string;
  adminPassword: string;
}): Promise<AdminActionResult> {
  await requireAdmin();

  const userIdError = validateAdminUserId(input.userId);
  if (userIdError) {
    return { success: false, error: userIdError };
  }

  const newPasswordError = validateAdminPassword(input.password);
  if (newPasswordError) {
    return { success: false, error: newPasswordError };
  }

  const passwordError = await verifyAdminPassword(input.adminPassword);
  if (passwordError) {
    return passwordError;
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    password: input.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/${input.userId}`);
  return { success: true };
}
