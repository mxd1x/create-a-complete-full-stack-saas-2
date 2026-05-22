"use server";

import { hash } from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { slugify } from "@/lib/org";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(2)
});

type ActionState = { error?: string; success?: string; token?: string };

export async function signupAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Use a valid name, company, email, and 8+ character password." };

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account already exists for this email." };

  const passwordHash = await hash(parsed.data.password, 12);
  const baseSlug = slugify(parsed.data.organizationName);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      role: email === process.env.ADMIN_EMAIL ? "ADMIN" : "USER",
      title: "Owner",
      organization: {
        create: {
          name: parsed.data.organizationName,
          slug
        }
      },
      subscriptions: {
        create: {
          plan: "Starter",
          status: "trialing",
          monthlyPriceCents: 4900,
          currentPeriodEnds: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
        }
      }
    }
  });

  redirect("/login?created=1");
}

export async function forgotPasswordAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  if (!email) return { error: "Email is required." };

  const token = crypto.randomBytes(32).toString("hex");
  const updated = await prisma.user.updateMany({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpires: new Date(Date.now() + 1000 * 60 * 30)
    }
  });

  const exposeToken = process.env.NODE_ENV === "development";
  return {
    success: "If an account exists, a reset token was generated. In production, wire this to your email provider.",
    token: exposeToken && updated.count > 0 ? token : undefined
  };
}

export async function resetPasswordAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!token || password.length < 8) return { error: "Use a valid reset token and an 8+ character password." };

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() }
    }
  });
  if (!user) return { error: "Reset token is invalid or expired." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hash(password, 12),
      resetToken: null,
      resetTokenExpires: null
    }
  });

  redirect("/login?reset=1");
}
