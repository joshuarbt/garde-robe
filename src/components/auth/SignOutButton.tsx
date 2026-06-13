import { signOut } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-stone-600 transition-colors hover:text-stone-900"
      >
        Sign out
      </button>
    </form>
  );
}
