"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploadField } from "@/components/wardrobe/ImageUploadField";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import { Icon } from "@/components/ui/Icon";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { actionIcons } from "@/lib/icons";
import type { ItemFormErrors, ItemFormInput, ItemType, WardrobeLookups } from "@/lib/types/item";
import { ITEM_TYPES } from "@/lib/types/item";
import { getItemTypeLabel } from "@/lib/i18n/item-types";
import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { uploadItemImage, uploadProcessedItemImage } from "@/lib/storage/upload";
import {
  completeBackgroundRemoval,
  saveItemMetadata,
  updateItemImagePath,
} from "@/lib/wardrobe/actions";
import type { BackgroundChoice } from "@/components/wardrobe/ImageUploadField";

type ItemFormProps = {
  lookups: WardrobeLookups;
  userId: string;
  itemId?: string;
  currentImageUrl?: string | null;
  initialValues?: Partial<ItemFormInput>;
  defaultCurrency?: string;
  submitLabel: string;
};

const FORM_ID = "item-form";
const inputClassName = "input-field mt-1.5";

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
  price: "",
  currency_code: DEFAULT_CURRENCY,
};

type SubmitPhase = "idle" | "saving" | "uploading" | "finishing";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-status-error mt-1 text-sm">{message}</p>;
}

function getSubmitLabel(phase: SubmitPhase, submitLabel: string): string {
  switch (phase) {
    case "saving":
      return "Enregistrement…";
    case "uploading":
      return "Téléversement de l'image…";
    case "finishing":
      return "Finalisation…";
    default:
      return submitLabel;
  }
}

type FormSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function FormSection({ title, defaultOpen = true, children }: FormSectionProps) {
  return (
    <details open={defaultOpen} className="group space-y-4">
      <summary className="flex min-h-[var(--touch-min)] cursor-pointer list-none items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-medium text-[var(--foreground)] md:hidden [&::-webkit-details-marker]:hidden">
        {title}
        <Icon
          icon={actionIcons.expand}
          size="sm"
          className="text-[var(--muted)] transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="space-y-4 pb-4 pt-2 md:pb-0 md:pt-0">
        <p className="input-label hidden md:block">{title}</p>
        {children}
      </div>
    </details>
  );
}

export function ItemForm({
  lookups,
  userId,
  itemId,
  currentImageUrl,
  initialValues,
  defaultCurrency = DEFAULT_CURRENCY,
  submitLabel,
}: ItemFormProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [values, setValues] = useState<ItemFormInput>({
    ...defaultValues,
    currency_code: defaultCurrency,
    ...initialValues,
  });
  const [fieldErrors, setFieldErrors] = useState<ItemFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundChoice, setBackgroundChoice] = useState<BackgroundChoice>({
    useProcessed: false,
    processedBlob: null,
  });
  const [phase, setPhase] = useState<SubmitPhase>("idle");

  const isPending = phase !== "idle";
  const buttonLabel = getSubmitLabel(phase, submitLabel);

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

        if (backgroundChoice.useProcessed && backgroundChoice.processedBlob) {
          const processedUpload = await uploadProcessedItemImage(
            backgroundChoice.processedBlob,
            userId,
            savedItemId,
          );

          if ("error" in processedUpload) {
            setImageError(processedUpload.error);
            setPhase("idle");
            return;
          }

          const completionResult = await completeBackgroundRemoval(savedItemId);
          if (!completionResult.success) {
            setImageError(completionResult.error);
            setPhase("idle");
            return;
          }
        }
      }

      router.push("/wardrobe");
      router.refresh();
    } catch {
      setFormError("Une erreur s'est produite. Veuillez réessayer.");
      setPhase("idle");
    }
  }

  function updateValue<K extends keyof ItemFormInput>(key: K, value: ItemFormInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <FormSection title="Essentiel" defaultOpen>
          <ImageUploadField
            currentImageUrl={currentImageUrl}
            disabled={isPending}
            onFileChange={setSelectedFile}
            onBackgroundChoiceChange={setBackgroundChoice}
            error={imageError}
          />

          <div>
            <label htmlFor="name" className="input-label">
              Nom
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
            <label htmlFor="item_type" className="input-label">
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
                  {getItemTypeLabel(type)}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.item_type} />
          </div>
        </FormSection>

        <FormSection title="Détails">
          <div>
            <label htmlFor="category_id" className="input-label">
              Catégorie
            </label>
            <select
              id="category_id"
              name="category_id"
              value={values.category_id}
              disabled={isPending}
              onChange={(event) => updateValue("category_id", event.target.value)}
              className={inputClassName}
            >
              <option value="">Sélectionner une catégorie existante</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.category_id} />
          </div>

          <div>
            <label htmlFor="new_category_name" className="input-label">
              Ou nouvelle catégorie
            </label>
            <input
              id="new_category_name"
              name="new_category_name"
              value={values.new_category_name}
              disabled={isPending || Boolean(values.category_id)}
              onChange={(event) => updateValue("new_category_name", event.target.value)}
              className={inputClassName}
              placeholder="ex. hauts, collier"
            />
            <FieldError message={fieldErrors.new_category_name} />
          </div>

          <div>
            <label htmlFor="color_id" className="input-label">
              Couleur
            </label>
            <select
              id="color_id"
              name="color_id"
              value={values.color_id}
              disabled={isPending}
              onChange={(event) => updateValue("color_id", event.target.value)}
              className={inputClassName}
            >
              <option value="">Aucune couleur</option>
              {lookups.colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.color_id} />
          </div>

          <div>
            <label htmlFor="brand_id" className="input-label">
              Marque
            </label>
            <select
              id="brand_id"
              name="brand_id"
              value={values.brand_id}
              disabled={isPending}
              onChange={(event) => updateValue("brand_id", event.target.value)}
              className={inputClassName}
            >
              <option value="">Aucune marque</option>
              {lookups.brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.brand_id} />
          </div>

          <div>
            <label htmlFor="new_brand_name" className="input-label">
              Ou nouvelle marque
            </label>
            <input
              id="new_brand_name"
              name="new_brand_name"
              value={values.new_brand_name}
              disabled={isPending || Boolean(values.brand_id)}
              onChange={(event) => updateValue("new_brand_name", event.target.value)}
              className={inputClassName}
              placeholder="Optionnel"
            />
            <FieldError message={fieldErrors.new_brand_name} />
          </div>
        </FormSection>

        <FormSection title="Optionnel">
          <fieldset>
            <legend className="input-label">Saisons</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {lookups.seasons.map((season) => {
                const checked = values.season_ids.includes(season.id);

                return (
                  <label
                    key={season.id}
                    className="flex min-h-[var(--touch-min)] items-center gap-2 text-sm text-[var(--foreground)]"
                  >
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="input-label">
                Prix
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={values.price}
                disabled={isPending}
                onChange={(event) => updateValue("price", event.target.value)}
                className={inputClassName}
                placeholder="Optionnel"
              />
              <FieldError message={fieldErrors.price} />
            </div>

            <div>
              <label htmlFor="currency_code" className="input-label">
                Devise
              </label>
              <select
                id="currency_code"
                name="currency_code"
                value={values.currency_code}
                disabled={isPending}
                onChange={(event) => updateValue("currency_code", event.target.value)}
                className={inputClassName}
              >
                {SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.currency_code} />
            </div>
          </div>

          <div>
            <label htmlFor="occasion_tags" className="input-label">
              Occasions
            </label>
            <input
              id="occasion_tags"
              name="occasion_tags"
              value={values.occasion_tags}
              disabled={isPending}
              onChange={(event) => updateValue("occasion_tags", event.target.value)}
              className={inputClassName}
              placeholder="travail, décontracté, formel"
            />
            <FieldError message={fieldErrors.occasion_tags} />
          </div>

          <div>
            <label htmlFor="notes" className="input-label">
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
        </FormSection>

        {formError ? (
          <p
            role="alert"
            className="alert-error"
          >
            {formError}
          </p>
        ) : null}

        {isDesktop ? (
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full disabled:opacity-60"
          >
            {buttonLabel}
          </button>
        ) : null}
      </form>

      {!isDesktop ? (
        <MobileActionBar withTabBar={false}>
          <button
            type="submit"
            form={FORM_ID}
            disabled={isPending}
            className="btn-primary w-full disabled:opacity-60"
          >
            {buttonLabel}
          </button>
        </MobileActionBar>
      ) : null}
    </>
  );
}
