import { SignupForm } from "@/components/auth/signup-form";
import { AuthLayout } from "@/components/crm/auth-layout";

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Set up your company workspace in minutes." footerVariant="signup">
      <SignupForm />
    </AuthLayout>
  );
}
