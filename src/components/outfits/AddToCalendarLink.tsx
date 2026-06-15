import Link from "next/link";

type AddToCalendarLinkProps = {
  outfitId: string;
};

export function AddToCalendarLink({ outfitId }: AddToCalendarLinkProps) {
  return (
    <Link href={`/calendar?outfitId=${outfitId}`} className="btn-ghost">
      Ajouter au calendrier
    </Link>
  );
}
