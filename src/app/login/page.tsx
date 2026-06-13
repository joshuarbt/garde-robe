import { LoginForm } from "@/components/auth/LoginForm";
import { PageShell } from "@/components/layout/PageShell";

export default function LoginPage() {
  return (
    <PageShell
      title="Sign in"
      description="Sign in with your email and password to access your wardrobe."
    >
      <LoginForm />
    </PageShell>
  );
}
