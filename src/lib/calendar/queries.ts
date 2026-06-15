import type { CalendarEntry, CalendarMonthData } from "@/lib/types/calendar";
import { createClient } from "@/lib/supabase/server";

type CalendarRow = {
  id: string;
  outfit_id: string;
  scheduled_date: string;
  notes: string | null;
  outfits: { name: string } | { name: string }[] | null;
};

function getOutfitName(row: CalendarRow): string {
  const outfits = row.outfits;
  if (Array.isArray(outfits)) {
    return outfits[0]?.name ?? "Tenue sans titre";
  }
  return outfits?.name ?? "Tenue sans titre";
}

export async function getCalendarEntries(
  year: number,
  month: number,
): Promise<CalendarMonthData> {
  const supabase = await createClient();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("outfit_calendar_entries")
    .select("id, outfit_id, scheduled_date, notes, outfits(name)")
    .gte("scheduled_date", startDate)
    .lte("scheduled_date", endDate)
    .order("scheduled_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const entries: CalendarEntry[] = (data as CalendarRow[]).map((row) => ({
    id: row.id,
    outfitId: row.outfit_id,
    outfitName: getOutfitName(row),
    scheduledDate: row.scheduled_date,
    notes: row.notes,
  }));

  return { year, month, entries };
}
