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
    errors.name = "Name is required.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  if (!ITEM_TYPES.includes(input.item_type)) {
    errors.item_type = "Select a valid item type.";
  }

  const newCategoryName = input.new_category_name.trim();
  if (input.category_id && !isUuid(input.category_id)) {
    errors.category_id = "Select a valid category.";
  } else if (!input.category_id && !newCategoryName) {
    errors.category_id = "Select a category or enter a new one.";
  } else if (newCategoryName.length > 50) {
    errors.new_category_name = "Category name must be 50 characters or fewer.";
  }

  if (input.color_id && !isUuid(input.color_id)) {
    errors.color_id = "Select a valid color.";
  }

  const newBrandName = input.new_brand_name.trim();
  if (input.brand_id && !isUuid(input.brand_id)) {
    errors.brand_id = "Select a valid brand.";
  } else if (newBrandName.length > 50) {
    errors.new_brand_name = "Brand name must be 50 characters or fewer.";
  }

  for (const seasonId of input.season_ids) {
    if (!isUuid(seasonId)) {
      errors.season_ids = "One or more seasons are invalid.";
      break;
    }
  }

  const occasionTags = parseOccasionTags(input.occasion_tags);
  if (occasionTags.length > 10) {
    errors.occasion_tags = "You can add up to 10 occasion tags.";
  } else if (occasionTags.some((tag) => tag.length > 30)) {
    errors.occasion_tags = "Each occasion tag must be 30 characters or fewer.";
  }

  const notes = input.notes.trim();
  if (notes.length > 500) {
    errors.notes = "Notes must be 500 characters or fewer.";
  }

  const priceRaw = input.price.trim();
  let parsedPrice: string | null = null;
  if (priceRaw) {
    const priceValue = Number(priceRaw);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      errors.price = "Enter a valid price (0 or greater).";
    } else if (!/^\d+(\.\d{1,2})?$/.test(priceRaw)) {
      errors.price = "Price can have at most 2 decimal places.";
    } else if (priceValue > 99999999.99) {
      errors.price = "Price is too large.";
    } else {
      parsedPrice = priceRaw;
    }
  }

  const currencyCode = input.currency_code.trim().toUpperCase();
  if (parsedPrice) {
    if (!currencyCode) {
      errors.currency_code = "Select a currency when entering a price.";
    } else if (!isValidCurrencyCode(currencyCode)) {
      errors.currency_code = "Select a valid currency.";
    }
  } else if (currencyCode && !isValidCurrencyCode(currencyCode)) {
    errors.currency_code = "Select a valid currency.";
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
  const seasonIds = formData
    .getAll("season_ids")
    .map((value) => String(value))
    .filter(Boolean);

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
