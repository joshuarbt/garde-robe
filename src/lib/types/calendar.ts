export type CalendarEntry = {
  id: string;
  outfitId: string;
  outfitName: string;
  scheduledDate: string;
  occasion?: string | null;
  notes?: string | null;
};

export type CalendarMonthData = {
  year: number;
  month: number;
  entries: CalendarEntry[];
};

export type AssignOutfitResult =
  | { success: true }
  | { success: false; error: string };

export type CalendarActionResult =
  | { success: true }
  | { success: false; error: string };
