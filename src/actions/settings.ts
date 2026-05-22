"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOrganizationId, requireSessionUser } from "@/lib/org";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().min(2),
  title: z.string().optional()
});

const orgSchema = z.object({
  name: z.string().min(2),
  industry: z.string().optional()
});

const notificationSchema = z.object({
  notifyFollowUpReminders: z.coerce.boolean(),
  notifyEmailDigest: z.coerce.boolean()
});

export async function updateProfileAction(formData: FormData) {
  const user = await requireSessionUser();
  const parsed = profileSchema.parse(Object.fromEntries(formData));
  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.name, title: parsed.title || null }
  });
  revalidatePath("/settings");
}

export async function updateOrganizationAction(formData: FormData) {
  const { organizationId } = await requireOrganizationId();
  const parsed = orgSchema.parse(Object.fromEntries(formData));
  await prisma.organization.update({
    where: { id: organizationId },
    data: { name: parsed.name, industry: parsed.industry || null }
  });
  revalidatePath("/settings");
}

export async function updateNotificationAction(formData: FormData) {
  const user = await requireSessionUser();
  const parsed = notificationSchema.parse({
    notifyFollowUpReminders: formData.get("notifyFollowUpReminders") === "on",
    notifyEmailDigest: formData.get("notifyEmailDigest") === "on"
  });
  await prisma.user.update({
    where: { id: user.id },
    data: parsed
  });
  revalidatePath("/settings");
}
