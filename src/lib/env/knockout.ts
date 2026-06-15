export function hasKnockoutToken(): boolean {
  return Boolean(process.env.KNOCKOUT_TOKEN?.trim());
}

export function getKnockoutToken(): string {
  const token = process.env.KNOCKOUT_TOKEN?.trim();

  if (!token) {
    throw new Error("KNOCKOUT_TOKEN is not configured.");
  }

  return token;
}
