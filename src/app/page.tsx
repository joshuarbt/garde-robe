import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { StaggerItem, StaggerList } from "@/components/layout/motion";

const sections = [
  {
    href: "/wardrobe",
    title: "Wardrobe",
    description: "Browse and manage your pieces.",
  },
  {
    href: "/outfits",
    title: "Outfits",
    description: "Compose and save looks on a visual canvas.",
  },
  {
    href: "/calendar",
    title: "Calendar",
    description: "Plan what to wear, day by day.",
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Your collection at a glance.",
  },
] as const;

export default function Home() {
  return (
    <PageShell
      eyebrow="Personal wardrobe"
      title="Your personal wardrobe"
      description="Catalog what you own and build outfits visually — clothing, accessories, and jewelry in one place."
    >
      <StaggerList className="grid gap-6 sm:grid-cols-2">
        {sections.map(({ href, title, description }) => (
          <StaggerItem key={href}>
            <Link
              href={href}
              className="interactive-lift surface-editorial block p-6"
            >
              <h2 className="font-display text-2xl font-normal text-[var(--foreground)]">
                {title}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
            </Link>
          </StaggerItem>
        ))}
      </StaggerList>
    </PageShell>
  );
}
