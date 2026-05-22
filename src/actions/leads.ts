"use server";

import { LeadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { leadSchema } from "@/lib/validations/lead";
import { requireOrganizationId } from "@/lib/org";
import { prisma } from "@/lib/prisma";

function parseLeadForm(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const followUpAt = raw.followUpAt ? String(raw.followUpAt) : undefined;
  const tags = raw.tags ? String(raw.tags).split(",").map((t) => t.trim()).filter(Boolean) : [];
  return leadSchema.parse({
    ...raw,
    followUpAt,
    tags: tags.join(",")
  });
}

export async function createLeadAction(formData: FormData) {
  const { userId, organizationId } = await requireOrganizationId();
  const parsed = parseLeadForm(formData);
  const tags = parsed.tags ? parsed.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const lead = await prisma.lead.create({
    data: {
      organizationId,
      createdById: userId,
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone || null,
      companyId: parsed.companyId || null,
      companyName: parsed.companyName || null,
      notes: parsed.notes || null,
      status: parsed.status ?? "NEW",
      priority: parsed.priority ?? "MEDIUM",
      assignedToId: parsed.assignedToId || null,
      followUpAt: parsed.followUpAt ? new Date(parsed.followUpAt) : null,
      tags
    }
  });

  await prisma.activityLog.create({
    data: { userId, leadId: lead.id, action: "Lead created", metadata: { name: lead.name } }
  });
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function updateLeadAction(formData: FormData) {
  const { userId, organizationId } = await requireOrganizationId();
  const id = String(formData.get("id"));
  const parsed = parseLeadForm(formData);
  const tags = parsed.tags ? parsed.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  await prisma.lead.update({
    where: { id, organizationId },
    data: {
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone || null,
      companyId: parsed.companyId || null,
      companyName: parsed.companyName || null,
      notes: parsed.notes || null,
      status: parsed.status,
      priority: parsed.priority,
      assignedToId: parsed.assignedToId || null,
      followUpAt: parsed.followUpAt ? new Date(parsed.followUpAt) : null,
      tags
    }
  });

  await prisma.activityLog.create({
    data: { userId, leadId: id, action: "Lead updated", metadata: { status: parsed.status } }
  });
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function deleteLeadAction(formData: FormData) {
  const { userId, organizationId } = await requireOrganizationId();
  const id = String(formData.get("id"));
  await prisma.lead.delete({ where: { id, organizationId } });
  await prisma.activityLog.create({
    data: { userId, action: "Lead deleted", metadata: { leadId: id } }
  });
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function moveLeadStatusAction(id: string, status: LeadStatus) {
  const { userId, organizationId } = await requireOrganizationId();
  await prisma.lead.update({
    where: { id, organizationId },
    data: { status }
  });
  await prisma.activityLog.create({
    data: { userId, leadId: id, action: "Lead moved", metadata: { status } }
  });
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}
