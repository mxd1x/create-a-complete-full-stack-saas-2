"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });
    setLoading(false);
    if (result?.error) setError("Invalid email or password.");
    else router.push("/dashboard");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {params.get("created") && <p className="rounded-md bg-teal-300/10 p-3 text-sm text-teal-100">Account created. Log in to continue.</p>}
      {params.get("reset") && <p className="rounded-md bg-teal-300/10 p-3 text-sm text-teal-100">Password reset. Log in with your new password.</p>}
      {error && <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Log in"}
      </Button>
    </form>
  );
}
