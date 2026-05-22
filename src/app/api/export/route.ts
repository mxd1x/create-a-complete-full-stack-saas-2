import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

export async function GET(request: NextRequest) {
  const auth = await requireApiUser();
  if ("response" in auth) return auth.response;

  const dbUser = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: { organizationId: true }
  });
  if (!dbUser?.organizationId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";

  const leads = await prisma.lead.findMany({
    where: { organizationId: dbUser.organizationId },
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { name: true } },
      assignedTo: { select: { name: true, email: true } }
    }
  });

  if (format === "json") {
    return new NextResponse(JSON.stringify(leads, null, 2), {
      headers: {
        "content-type": "application/json",
        "content-disposition": "attachment; filename=pipeline-crm-leads.json"
      }
    });
  }

  const headers = [
    "name",
    "email",
    "phone",
    "company",
    "status",
    "priority",
    "assignedTo",
    "followUpAt",
    "notes"
  ];
  const rows = leads.map((lead) =>
    [
      lead.name,
      lead.email,
      lead.phone,
      lead.company?.name ?? lead.companyName,
      lead.status,
      lead.priority,
      lead.assignedTo?.name,
      lead.followUpAt?.toISOString(),
      lead.notes
    ]
      .map(csvEscape)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": "attachment; filename=pipeline-crm-leads.csv"
    }
  });
}
