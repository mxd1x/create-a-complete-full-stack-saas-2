"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizationId } from "@/lib/org";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/lib/validations/company";

export async function createCompanyAction(formData: FormData) {
  const { organizationId } = await requireOrganizationId();
  const parsed = companySchema.parse(Object.fromEntries(formData));

  await prisma.company.create({
    data: {
      organizationId,
      name: parsed.name,
      website: parsed.website || null,
      industry: parsed.industry || null,
      size: parsed.size || null
    }
  });
  revalidatePath("/companies");
  revalidatePath("/leads");
}

export async function updateCompanyAction(formData: FormData) {
  const { organizationId } = await requireOrganizationId();
  const id = String(formData.get("id"));
  const parsed = companySchema.parse(Object.fromEntries(formData));

  await prisma.company.update({
    where: { id, organizationId },
    data: {
      name: parsed.name,
      website: parsed.website || null,
      industry: parsed.industry || null,
      size: parsed.size || null
    }
  });
  revalidatePath("/companies");
  revalidatePath("/leads");
}

export async function deleteCompanyAction(formData: FormData) {
  const { organizationId } = await requireOrganizationId();
  const id = String(formData.get("id"));
  await prisma.company.delete({ where: { id, organizationId } });
  revalidatePath("/companies");
  revalidatePath("/leads");
}
