import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireOrganizationId() {
  const user = await requireSessionUser();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  });
  if (!dbUser?.organizationId) redirect("/login");
  return { userId: user.id, organizationId: dbUser.organizationId };
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "workspace";
}
