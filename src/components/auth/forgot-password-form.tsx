"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, {});

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state.error && <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{state.error}</p>}
      {state.success && (
        <div className="rounded-md bg-teal-300/10 p-3 text-sm text-teal-100">
          <p>{state.success}</p>
          {state.token && <p className="mt-2 break-all font-mono text-xs text-teal-50">{state.token}</p>}
          {state.token && <a className="mt-3 inline-block text-teal-50 underline" href={`/reset-password?token=${state.token}`}>Continue to reset password</a>}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "Generating..." : "Generate reset token"}</Button>
    </form>
  );
}
