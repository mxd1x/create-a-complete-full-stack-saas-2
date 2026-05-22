import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/crm/auth-layout";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Pipeline CRM workspace." footerVariant="login">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
