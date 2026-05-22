"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ token }: { token?: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, {});

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state.error && <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{state.error}</p>}
      <div className="space-y-2">
        <Label htmlFor="token">Reset token</Label>
        <Input id="token" name="token" defaultValue={token} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "Resetting..." : "Reset password"}</Button>
    </form>
  );
}
