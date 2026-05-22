import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthLayout } from "@/components/crm/auth-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset password" subtitle="We'll send reset instructions if an account exists." footerVariant="forgot">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
