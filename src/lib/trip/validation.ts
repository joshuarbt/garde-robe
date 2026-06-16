import type { TripFormErrors, TripFormInput } from "@/lib/types/trip";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  if (!DATE_REGEX.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return value;
}

export function parseTripFormData(formData: FormData): TripFormInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    destination: String(formData.get("destination") ?? "").trim(),
    start_date: String(formData.get("start_date") ?? "").trim(),
    end_date: String(formData.get("end_date") ?? "").trim(),
  };
}

export function validateTripFormInput(input: TripFormInput): TripFormErrors {
  const errors: TripFormErrors = {};

  if (!input.name) {
    errors.name = "Le nom du voyage est requis.";
  }

  if (input.start_date && !parseDate(input.start_date)) {
    errors.start_date = "Date de début invalide.";
  }

  if (input.end_date && !parseDate(input.end_date)) {
    errors.end_date = "Date de fin invalide.";
  }

  if (
    input.start_date &&
    input.end_date &&
    parseDate(input.start_date) &&
    parseDate(input.end_date) &&
    input.end_date < input.start_date
  ) {
    errors.end_date = "La date de fin doit être après la date de début.";
  }

  return errors;
}

export function normalizeTripDates(input: TripFormInput): {
  start_date: string | null;
  end_date: string | null;
} {
  return {
    start_date: parseDate(input.start_date),
    end_date: parseDate(input.end_date),
  };
}
