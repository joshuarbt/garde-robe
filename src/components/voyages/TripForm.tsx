"use client";

import { useState } from "react";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { createTrip } from "@/lib/trip/actions";
import type { TripFormErrors } from "@/lib/types/trip";

const FORM_ID = "trip-form";
const inputClassName = "input-field mt-1.5";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-status-error mt-1 text-sm">{message}</p>;
}

export function TripForm() {
  const isDesktop = useIsDesktop();
  const [fieldErrors, setFieldErrors] = useState<TripFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsPending(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await createTrip(formData);

      if (!result.success) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        setIsPending(false);
      }
    } catch {
      setFormError("Une erreur s'est produite. Veuillez réessayer.");
      setIsPending(false);
    }
  }

  return (
    <>
      <form id={FORM_ID} onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="input-label">
            Nom du voyage
          </label>
          <input
            id="name"
            name="name"
            required
            disabled={isPending}
            className={inputClassName}
            placeholder="Week-end Paris"
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div>
          <label htmlFor="destination" className="input-label">
            Destination <span className="text-[var(--muted)]">(optionnel)</span>
          </label>
          <input
            id="destination"
            name="destination"
            disabled={isPending}
            className={inputClassName}
            placeholder="Paris"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start_date" className="input-label">
              Début <span className="text-[var(--muted)]">(optionnel)</span>
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              disabled={isPending}
              className={inputClassName}
            />
            <FieldError message={fieldErrors.start_date} />
          </div>
          <div>
            <label htmlFor="end_date" className="input-label">
              Fin <span className="text-[var(--muted)]">(optionnel)</span>
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              disabled={isPending}
              className={inputClassName}
            />
            <FieldError message={fieldErrors.end_date} />
          </div>
        </div>

        {formError ? (
          <p role="alert" className="text-status-error text-sm">
            {formError}
          </p>
        ) : null}

        {isDesktop ? (
          <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
            {isPending ? "Création…" : "Créer le voyage"}
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
            {isPending ? "Création…" : "Créer le voyage"}
          </button>
        </MobileActionBar>
      ) : null}
    </>
  );
}
