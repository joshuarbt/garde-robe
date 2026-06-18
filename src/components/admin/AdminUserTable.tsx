import Link from "next/link";
import type { AdminUserSummary } from "@/lib/admin/types";

type AdminUserTableProps = {
  users: AdminUserSummary[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminUserTable({ users }: AdminUserTableProps) {
  if (users.length === 0) {
    return <p className="text-caption text-[var(--muted)]">Aucun utilisateur.</p>;
  }

  return (
    <div className="overflow-x-auto border border-[var(--border-hairline)]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border-hairline)] bg-[var(--surface-muted)]">
            <th className="text-overline px-4 py-3 font-medium">E-mail</th>
            <th className="text-overline px-4 py-3 font-medium">Articles</th>
            <th className="text-overline px-4 py-3 font-medium">Tenues</th>
            <th className="text-overline px-4 py-3 font-medium">Dernière connexion</th>
            <th className="text-overline px-4 py-3 font-medium">Inscription</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-[var(--border-hairline)] last:border-b-0"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/${user.id}`}
                  className="font-medium text-[var(--foreground)] underline-offset-2 hover:underline"
                >
                  {user.email}
                </Link>
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">{user.itemCount}</td>
              <td className="px-4 py-3 text-[var(--muted)]">{user.outfitCount}</td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {formatDate(user.lastSignInAt)}
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
