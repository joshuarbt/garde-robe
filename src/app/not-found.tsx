import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell
      title="Page not found"
      description="The page you are looking for does not exist or may have been removed."
    >
      <Link href="/" className="btn-primary inline-block">
        Back to home
      </Link>
    </PageShell>
  );
}
