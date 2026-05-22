import { LeadPriority, LeadStatus, Prisma } from "@prisma/client";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/crm/page-header";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { LeadsPagination, LeadsTable } from "@/components/leads/leads-table";
import { PipelineBoard } from "@/components/leads/pipeline-board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { priorities, statuses } from "@/lib/lead-meta";
import { requireOrganizationId } from "@/lib/org";
import { prisma } from "@/lib/prisma";

const pageSize = 10;

export default async function LeadsPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    company?: string;
    page?: string;
  }>;
}) {
  const { organizationId } = await requireOrganizationId();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const q = params.q?.trim();
  const status = statuses.includes(params.status as LeadStatus) ? (params.status as LeadStatus) : undefined;
  const priority = priorities.includes(params.priority as LeadPriority)
    ? (params.priority as LeadPriority)
    : undefined;

  const where: Prisma.LeadWhereInput = {
    organizationId,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(params.assignee ? { assignedToId: params.assignee } : {}),
    ...(params.company ? { companyId: params.company } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } },
            { company: { name: { contains: q, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const [leads, count, kanbanLeads, companies, members] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { company: true, assignedTo: true }
    }),
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where: { organizationId },
      orderBy: { updatedAt: "desc" },
      take: 200,
      include: { assignedTo: { select: { name: true } } }
    }),
    prisma.company.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    }),
    prisma.user.findMany({
      where: { organizationId },
      select: { id: true, name: true }
    })
  ]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const filterParams = {
    q: params.q,
    status: params.status,
    priority: params.priority,
    assignee: params.assignee,
    company: params.company
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CRM"
        title="Leads"
        description="Manage contacts, filter your pipeline, and move deals through stages."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <a href="/api/export?format=csv">
                <Download className="h-4 w-4" />
                CSV
              </a>
            </Button>
            <LeadDialog companies={companies} members={members} />
          </>
        }
      />

      <Card className="border-white/[0.06] bg-[#111113]">
        <CardHeader>
          <CardTitle className="text-base">Search & filter</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadFilters companies={companies} members={members} />
        </CardContent>
      </Card>

      <Card className="border-white/[0.06] bg-[#111113]">
        <CardHeader>
          <CardTitle className="text-base">All leads</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <LeadsTable leads={leads} companies={companies} members={members} />
          <LeadsPagination page={page} totalPages={totalPages} searchParams={filterParams} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-sm font-medium text-white/60">Pipeline board</h2>
        <PipelineBoard leads={kanbanLeads} />
      </div>
    </div>
  );
}
