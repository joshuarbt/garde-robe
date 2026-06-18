import { isUuid } from "@/lib/wardrobe/validation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateAdminUserId(userId: string): string | null {
  if (!isUuid(userId)) {
    return "Identifiant utilisateur invalide.";
  }

  return null;
}

export function validateAdminEmail(email: string): string | null {
  const trimmed = email.trim();

  if (!trimmed) {
    return "L'adresse e-mail est obligatoire.";
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return "Adresse e-mail invalide.";
  }

  return null;
}

export function validateAdminPassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit comporter au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }

  return null;
}
