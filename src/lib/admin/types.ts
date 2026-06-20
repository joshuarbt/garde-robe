export type AdminUserSummary = {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  isEmailConfirmed: boolean;
  itemCount: number;
  outfitCount: number;
  tripCount: number;
};

export type AdminUserDetail = AdminUserSummary;

export type AdminActionResult =
  | { success: true }
  | { success: false; error: string };
