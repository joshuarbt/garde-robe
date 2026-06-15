import {
  ITEM_TYPES,
  type ItemFormErrors,
  type ItemFormInput,
  type ItemType,
} from "@/lib/types/item";
import { isValidCurrencyCode } from "@/lib/currency";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

function parseOccasionTags(raw: string): string[] {
  if (!raw.trim()) {
    return [];
  }

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function validateItemFormInput(
  input: ItemFormInput,
): { data: ItemFormInput; errors: ItemFormErrors } | { errors: ItemFormErrors } {
  const errors: ItemFormErrors = {};

  const name = input.name.trim();
  if (!name) {
    errors.name = "Le nom est obligatoire.";
  } else if (name.length > 100) {
    errors.name = "Le nom doit comporter 100 caractères ou moins.";
  }

  if (!ITEM_TYPES.includes(input.item_type)) {
    errors.item_type = "Sélectionnez un type de vêtement valide.";
  }

  const newCategoryName = input.new_category_name.trim();
  if (input.category_id && !isUuid(input.category_id)) {
    errors.category_id = "Sélectionnez une catégorie valide.";
  } else if (!input.category_id && !newCategoryName) {
    errors.category_id = "Sélectionnez une catégorie ou saisissez-en une nouvelle.";
  } else if (newCategoryName.length > 50) {
    errors.new_category_name = "Le nom de la catégorie doit comporter 50 caractères ou moins.";
  }

  if (input.color_id && !isUuid(input.color_id)) {
    errors.color_id = "Sélectionnez une couleur valide.";
  }

  const newBrandName = input.new_brand_name.trim();
  if (input.brand_id && !isUuid(input.brand_id)) {
    errors.brand_id = "Sélectionnez une marque valide.";
  } else if (newBrandName.length > 50) {
    errors.new_brand_name = "Le nom de la marque doit comporter 50 caractères ou moins.";
  }

  for (const seasonId of input.season_ids) {
    if (!isUuid(seasonId)) {
      errors.season_ids = "Une ou plusieurs saisons sont invalides.";
      break;
    }
  }

  const occasionTags = parseOccasionTags(input.occasion_tags);
  if (occasionTags.length > 10) {
    errors.occasion_tags = "Vous pouvez ajouter jusqu'à 10 occasions.";
  } else if (occasionTags.some((tag) => tag.length > 30)) {
    errors.occasion_tags = "Chaque occasion doit comporter 30 caractères ou moins.";
  }

  const notes = input.notes.trim();
  if (notes.length > 500) {
    errors.notes = "Les notes doivent comporter 500 caractères ou moins.";
  }

  const priceRaw = input.price.trim();
  let parsedPrice: string | null = null;
  if (priceRaw) {
    const priceValue = Number(priceRaw);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      errors.price = "Saisissez un prix valide (0 ou plus).";
    } else if (!/^\d+(\.\d{1,2})?$/.test(priceRaw)) {
      errors.price = "Le prix peut avoir au maximum 2 décimales.";
    } else if (priceValue > 99999999.99) {
      errors.price = "Le prix est trop élevé.";
    } else {
      parsedPrice = priceRaw;
    }
  }

  const currencyCode = input.currency_code.trim().toUpperCase();
  if (parsedPrice) {
    if (!currencyCode) {
      errors.currency_code = "Sélectionnez une devise lorsque vous saisissez un prix.";
    } else if (!isValidCurrencyCode(currencyCode)) {
      errors.currency_code = "Sélectionnez une devise valide.";
    }
  } else if (currencyCode && !isValidCurrencyCode(currencyCode)) {
    errors.currency_code = "Sélectionnez une devise valide.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      ...input,
      name,
      new_category_name: newCategoryName,
      new_brand_name: newBrandName,
      occasion_tags: input.occasion_tags.trim(),
      notes,
      price: parsedPrice ?? "",
      currency_code: currencyCode,
    },
    errors: {},
  };
}

export function parseItemFormData(formData: FormData): ItemFormInput {
  const seasonIds = [
    ...new Set(
      formData
        .getAll("season_ids")
        .map((value) => String(value))
        .filter(Boolean),
    ),
  ];

  return {
    name: String(formData.get("name") ?? ""),
    item_type: String(formData.get("item_type") ?? "clothing") as ItemType,
    category_id: String(formData.get("category_id") ?? ""),
    new_category_name: String(formData.get("new_category_name") ?? ""),
    color_id: String(formData.get("color_id") ?? ""),
    brand_id: String(formData.get("brand_id") ?? ""),
    new_brand_name: String(formData.get("new_brand_name") ?? ""),
    season_ids: seasonIds,
    occasion_tags: String(formData.get("occasion_tags") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    price: String(formData.get("price") ?? ""),
    currency_code: String(formData.get("currency_code") ?? ""),
  };
}

export { parseOccasionTags };
