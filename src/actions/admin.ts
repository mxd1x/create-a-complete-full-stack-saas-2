"use server";

import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") throw new Error("Admin access required.");
  return session.user;
}

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = z.object({ id: z.string(), role: z.nativeEnum(Role) }).parse(Object.fromEntries(formData));
  await prisma.user.update({ where: { id: parsed.id }, data: { role: parsed.role } });
  await prisma.activityLog.create({
    data: { userId: admin.id, action: "Admin updated user role", metadata: { userId: parsed.id, role: parsed.role } }
  });
  revalidatePath("/admin");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || id === admin.id) return;
  await prisma.user.delete({ where: { id } });
  await prisma.activityLog.create({
    data: { userId: admin.id, action: "Admin deleted user", metadata: { userId: id } }
  });
  revalidatePath("/admin");
}
