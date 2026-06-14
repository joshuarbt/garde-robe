import { SignUpForm } from "@/components/auth/SignUpForm";
import { PageShell } from "@/components/layout/PageShell";

export default function SignUpPage() {
  return (
    <PageShell title="Create account">
      <SignUpForm />
    </PageShell>
  );
}
