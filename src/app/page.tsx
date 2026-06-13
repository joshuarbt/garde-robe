import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

const sections = [
  {
    href: "/wardrobe",
    title: "Wardrobe",
    description: "Browse and manage your clothing, accessories, and jewelry.",
  },
  {
    href: "/outfits",
    title: "Outfits",
    description: "Compose and save looks on a visual canvas.",
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Overview of your wardrobe at a glance.",
  },
] as const;

export default function Home() {
  return (
    <PageShell
      title="Your personal wardrobe"
      description="Catalog what you own and build outfits visually. Garde-robe helps you organize clothing, accessories, and jewelry in one place."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ href, title, description }) => (
          <li key={href}>
            <Link
              href={href}
              className="block rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300"
            >
              <h2 className="font-medium text-stone-900">{title}</h2>
              <p className="mt-1 text-sm text-stone-600">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
