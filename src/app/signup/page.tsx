import { SignUpForm } from "@/components/auth/SignUpForm";
import { PageShell } from "@/components/layout/PageShell";

export default function SignUpPage() {
  return (
    <PageShell
      title="Create account"
      description="Sign up with your email and password to start building your wardrobe."
    >
      <SignUpForm />
    </PageShell>
  );
}
