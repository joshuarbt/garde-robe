import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { listUsersWithStats } from "@/lib/admin/queries";

export default async function AdminPage() {
  const { users, total } = await listUsersWithStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-title">Utilisateurs</h2>
          <p className="text-caption mt-1 text-[var(--muted)]">
            {total} compte{total > 1 ? "s" : ""} enregistré{total > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <AdminUserTable users={users} />
    </div>
  );
}
