import { redirect } from "next/navigation";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { PageShell } from "@/components/layout/PageShell";
import { DismissibleBanner } from "@/components/ui/DismissibleBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCalendarEntries } from "@/lib/calendar/queries";
import { getOutfits } from "@/lib/outfit/queries";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/wardrobe/validation";

type CalendarPageProps = {
  searchParams: Promise<{ year?: string; month?: string; outfitId?: string }>;
};

function parseMonthYear(searchParams: { year?: string; month?: string }) {
  const now = new Date();
  const year = searchParams.year ? Number(searchParams.year) : now.getFullYear();
  const month = searchParams.month ? Number(searchParams.month) : now.getMonth() + 1;

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    year < 2000 ||
    year > 2100
  ) {
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  return { year, month };
}

function getOutfitLinkWarning(
  rawOutfitId: string | undefined,
  preselectedOutfitId: string | undefined,
  preselectedOutfitFound: boolean,
): string | undefined {
  if (!rawOutfitId) {
    return undefined;
  }

  if (!preselectedOutfitId) {
    return "The outfit link is invalid. Choose an outfit from your saved list.";
  }

  if (!preselectedOutfitFound) {
    return "That outfit was not found. It may have been deleted.";
  }

  return undefined;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const { year, month } = parseMonthYear(params);
  const rawOutfitId = params.outfitId;
  const preselectedOutfitId =
    rawOutfitId && isUuid(rawOutfitId) ? rawOutfitId : undefined;

  const [calendarData, outfits] = await Promise.all([
    getCalendarEntries(year, month),
    getOutfits(),
  ]);

  const preselectedOutfit = preselectedOutfitId
    ? outfits.find((outfit) => outfit.id === preselectedOutfitId)
    : undefined;

  const outfitLinkWarning = getOutfitLinkWarning(
    rawOutfitId,
    preselectedOutfitId,
    Boolean(preselectedOutfit),
  );

  return (
    <PageShell
      title="Calendar"
      description="Plan what to wear. Assign one saved outfit per day."
      wide
    >
      {outfitLinkWarning ? <DismissibleBanner message={outfitLinkWarning} /> : null}

      {outfits.length === 0 ? (
        <EmptyState
          className="mb-8"
          message="Save an outfit first to use the calendar."
          actionLabel="Build your first outfit"
          actionHref="/outfits/new"
        />
      ) : (
        <CalendarGrid
          year={calendarData.year}
          month={calendarData.month}
          entries={calendarData.entries}
          outfits={outfits}
          preselectedOutfitId={preselectedOutfit?.id}
          preselectedOutfitName={preselectedOutfit?.name}
        />
      )}
    </PageShell>
  );
}
