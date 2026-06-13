"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploadField } from "@/components/wardrobe/ImageUploadField";
import type { ItemFormErrors, ItemFormInput, ItemType, WardrobeLookups } from "@/lib/types/item";
import { ITEM_TYPES } from "@/lib/types/item";
import { uploadItemImage } from "@/lib/storage/upload";
import {
  saveItemMetadata,
  updateItemImagePath,
} from "@/lib/wardrobe/actions";

type ItemFormProps = {
  lookups: WardrobeLookups;
  userId: string;
  itemId?: string;
  currentImageUrl?: string | null;
  initialValues?: Partial<ItemFormInput>;
  submitLabel: string;
};

const inputClassName =
  "mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-60";

const defaultValues: ItemFormInput = {
  name: "",
  item_type: "clothing",
  category_id: "",
  new_category_name: "",
  color_id: "",
  brand_id: "",
  new_brand_name: "",
  season_ids: [],
  occasion_tags: "",
  notes: "",
};

type SubmitPhase = "idle" | "saving" | "uploading" | "finishing";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm text-red-700">{message}</p>;
}

function getSubmitLabel(phase: SubmitPhase, submitLabel: string): string {
  switch (phase) {
    case "saving":
      return "Saving…";
    case "uploading":
      return "Uploading image…";
    case "finishing":
      return "Finishing…";
    default:
      return submitLabel;
  }
}

export function ItemForm({
  lookups,
  userId,
  itemId,
  currentImageUrl,
  initialValues,
  submitLabel,
}: ItemFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ItemFormInput>({
    ...defaultValues,
    ...initialValues,
  });
  const [fieldErrors, setFieldErrors] = useState<ItemFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<SubmitPhase>("idle");

  const isPending = phase !== "idle";

  const filteredCategories = lookups.categories.filter(
    (category) => category.item_type === values.item_type,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setImageError(null);
    setFieldErrors({});
    setPhase("saving");

    const formData = new FormData(event.currentTarget);

    try {
      const metadataResult = await saveItemMetadata(formData, itemId);
      if (!metadataResult.success) {
        setFormError(metadataResult.error);
        setFieldErrors(metadataResult.fieldErrors ?? {});
        setPhase("idle");
        return;
      }

      const savedItemId = metadataResult.itemId;

      if (selectedFile) {
        setPhase("uploading");

        const uploadResult = await uploadItemImage(selectedFile, userId, savedItemId);
        if ("error" in uploadResult) {
          setImageError(uploadResult.error);
          setPhase("idle");
          return;
        }

        setPhase("finishing");

        const pathResult = await updateItemImagePath(savedItemId, uploadResult.path);
        if (!pathResult.success) {
          setImageError(pathResult.error);
          setPhase("idle");
          return;
        }
      }

      router.push("/wardrobe");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setPhase("idle");
    }
  }

  function updateValue<K extends keyof ItemFormInput>(key: K, value: ItemFormInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploadField
        currentImageUrl={currentImageUrl}
        disabled={isPending}
        onFileChange={setSelectedFile}
        error={imageError}
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          value={values.name}
          disabled={isPending}
          onChange={(event) => updateValue("name", event.target.value)}
          className={inputClassName}
        />
        <FieldError message={fieldErrors.name} />
      </div>

      <div>
        <label htmlFor="item_type" className="block text-sm font-medium text-stone-700">
          Type
        </label>
        <select
          id="item_type"
          name="item_type"
          value={values.item_type}
          disabled={isPending}
          onChange={(event) => {
            updateValue("item_type", event.target.value as ItemType);
            updateValue("category_id", "");
          }}
          className={inputClassName}
        >
          {ITEM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <FieldError message={fieldErrors.item_type} />
      </div>

      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-stone-700">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={values.category_id}
          disabled={isPending}
          onChange={(event) => updateValue("category_id", event.target.value)}
          className={inputClassName}
        >
          <option value="">Select existing category</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FieldError message={fieldErrors.category_id} />
      </div>

      <div>
        <label
          htmlFor="new_category_name"
          className="block text-sm font-medium text-stone-700"
        >
          Or new category
        </label>
        <input
          id="new_category_name"
          name="new_category_name"
          value={values.new_category_name}
          disabled={isPending || Boolean(values.category_id)}
          onChange={(event) => updateValue("new_category_name", event.target.value)}
          className={inputClassName}
          placeholder="e.g. tops, necklace"
        />
        <FieldError message={fieldErrors.new_category_name} />
      </div>

      <div>
        <label htmlFor="color_id" className="block text-sm font-medium text-stone-700">
          Color
        </label>
        <select
          id="color_id"
          name="color_id"
          value={values.color_id}
          disabled={isPending}
          onChange={(event) => updateValue("color_id", event.target.value)}
          className={inputClassName}
        >
          <option value="">No color</option>
          {lookups.colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </select>
        <FieldError message={fieldErrors.color_id} />
      </div>

      <div>
        <label htmlFor="brand_id" className="block text-sm font-medium text-stone-700">
          Brand
        </label>
        <select
          id="brand_id"
          name="brand_id"
          value={values.brand_id}
          disabled={isPending}
          onChange={(event) => updateValue("brand_id", event.target.value)}
          className={inputClassName}
        >
          <option value="">No brand</option>
          {lookups.brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        <FieldError message={fieldErrors.brand_id} />
      </div>

      <div>
        <label htmlFor="new_brand_name" className="block text-sm font-medium text-stone-700">
          Or new brand
        </label>
        <input
          id="new_brand_name"
          name="new_brand_name"
          value={values.new_brand_name}
          disabled={isPending || Boolean(values.brand_id)}
          onChange={(event) => updateValue("new_brand_name", event.target.value)}
          className={inputClassName}
          placeholder="Optional"
        />
        <FieldError message={fieldErrors.new_brand_name} />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-stone-700">Seasons</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {lookups.seasons.map((season) => {
            const checked = values.season_ids.includes(season.id);

            return (
              <label key={season.id} className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  name="season_ids"
                  value={season.id}
                  checked={checked}
                  disabled={isPending}
                  onChange={(event) => {
                    if (event.target.checked) {
                      updateValue("season_ids", [...values.season_ids, season.id]);
                    } else {
                      updateValue(
                        "season_ids",
                        values.season_ids.filter((id) => id !== season.id),
                      );
                    }
                  }}
                />
                {season.name}
              </label>
            );
          })}
        </div>
        <FieldError message={fieldErrors.season_ids} />
      </fieldset>

      <div>
        <label
          htmlFor="occasion_tags"
          className="block text-sm font-medium text-stone-700"
        >
          Occasion tags
        </label>
        <input
          id="occasion_tags"
          name="occasion_tags"
          value={values.occasion_tags}
          disabled={isPending}
          onChange={(event) => updateValue("occasion_tags", event.target.value)}
          className={inputClassName}
          placeholder="work, casual, formal"
        />
        <FieldError message={fieldErrors.occasion_tags} />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-stone-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={values.notes}
          disabled={isPending}
          onChange={(event) => updateValue("notes", event.target.value)}
          className={inputClassName}
        />
        <FieldError message={fieldErrors.notes} />
      </div>

      {formError ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {getSubmitLabel(phase, submitLabel)}
      </button>
    </form>
  );
}
