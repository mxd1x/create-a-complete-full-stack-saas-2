import { LeadPriority, LeadStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(LeadPriority).optional(),
  assignedToId: z.string().optional().nullable(),
  followUpAt: z.string().optional().nullable()
});

async function getOrgId(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { organizationId: true } });
  return user?.organizationId;
}

export async function GET(request: NextRequest) {
  const auth = await requireApiUser();
  if ("response" in auth) return auth.response;
  const organizationId = await getOrgId(auth.user.id);
  if (!organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const leads = await prisma.lead.findMany({
    where: {
      organizationId,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { companyName: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" },
    include: { company: true, assignedTo: { select: { id: true, name: true, email: true } } }
  });
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser();
  if ("response" in auth) return auth.response;
  const organizationId = await getOrgId(auth.user.id);
  if (!organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const input = schema.parse(await request.json());
  const lead = await prisma.lead.create({
    data: {
      organizationId,
      createdById: auth.user.id,
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      companyId: input.companyId || null,
      companyName: input.companyName || null,
      notes: input.notes || null,
      status: input.status ?? "NEW",
      priority: input.priority ?? "MEDIUM",
      assignedToId: input.assignedToId || null,
      followUpAt: input.followUpAt ? new Date(input.followUpAt) : null
    }
  });
  await prisma.activityLog.create({
    data: { userId: auth.user.id, leadId: lead.id, action: "Lead created via API" }
  });
  return NextResponse.json(lead, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireApiUser();
  if ("response" in auth) return auth.response;
  const organizationId = await getOrgId(auth.user.id);
  if (!organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const input = schema.extend({ id: z.string() }).parse(await request.json());
  const lead = await prisma.lead.update({
    where: { id: input.id, organizationId },
    data: {
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      companyId: input.companyId || null,
      companyName: input.companyName || null,
      notes: input.notes || null,
      status: input.status,
      priority: input.priority,
      assignedToId: input.assignedToId || null,
      followUpAt: input.followUpAt ? new Date(input.followUpAt) : null
    }
  });
  await prisma.activityLog.create({
    data: { userId: auth.user.id, leadId: lead.id, action: "Lead updated via API" }
  });
  return NextResponse.json(lead);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiUser();
  if ("response" in auth) return auth.response;
  const organizationId = await getOrgId(auth.user.id);
  if (!organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const { id } = z.object({ id: z.string() }).parse(await request.json());
  await prisma.lead.delete({ where: { id, organizationId } });
  await prisma.activityLog.create({
    data: { userId: auth.user.id, action: "Lead deleted via API", metadata: { id } }
  });
  return NextResponse.json({ ok: true });
}
