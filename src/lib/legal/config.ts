/**
 * Informations du responsable de traitement (RGPD).
 * Remplacez les valeurs par défaut via les variables d'environnement en production.
 */
export const legalConfig = {
  controllerName:
    process.env.LEGAL_CONTROLLER_NAME?.trim() || "[Nom du responsable de traitement]",
  contactEmail:
    process.env.LEGAL_CONTACT_EMAIL?.trim() || "contact@example.com",
  supabaseRegion:
    process.env.LEGAL_SUPABASE_REGION?.trim() ||
    "Union européenne (région de votre projet Supabase)",
  lastUpdated: "13 juin 2026",
} as const;
