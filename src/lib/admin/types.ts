export type AdminUserSummary = {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  itemCount: number;
  outfitCount: number;
  tripCount: number;
};

export type AdminUserDetail = AdminUserSummary;

export type AdminActionResult =
  | { success: true }
  | { success: false; error: string };
