import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthLayout } from "@/components/crm/auth-layout";

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Set new password" subtitle="Choose a strong password for your account." footerVariant="reset">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
