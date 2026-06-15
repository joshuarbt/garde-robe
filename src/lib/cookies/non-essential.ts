/**
 * Non-essential cookie categories. Wire any future SDK through
 * NonEssentialScripts — never load before explicit consent.
 */
export const NON_ESSENTIAL_CATEGORIES = {
  analytics: {
    id: "analytics",
    label: "Mesure d'audience",
    description:
      "Statistiques anonymes sur l'utilisation du site (non actif pour l'instant).",
  },
} as const;

export type NonEssentialCategoryId = keyof typeof NON_ESSENTIAL_CATEGORIES;
