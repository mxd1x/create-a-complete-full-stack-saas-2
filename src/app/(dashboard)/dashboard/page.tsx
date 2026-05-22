import Link from "next/link";
import { LeadStatus } from "@prisma/client";
import { PageHeader } from "@/components/crm/page-header";
import { StatCard } from "@/components/crm/stat-card";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { PriorityBadge } from "@/components/dashboard/priority-badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabels, statuses } from "@/lib/lead-meta";
import { requireOrganizationId } from "@/lib/org";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const { organizationId } = await requireOrganizationId();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [leadCount, openCount, wonThisMonth, recentLeads, statusGroups, logs] = await Promise.all([
    prisma.lead.count({ where: { organizationId } }),
    prisma.lead.count({
      where: { organizationId, status: { notIn: [LeadStatus.WON, LeadStatus.LOST] } }
    }),
    prisma.lead.count({
      where: { organizationId, status: LeadStatus.WON, updatedAt: { gte: startOfMonth } }
    }),
    prisma.lead.findMany({
      where: { organizationId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { assignedTo: { select: { name: true } }, company: { select: { name: true } } }
    }),
    prisma.lead.groupBy({ by: ["status"], where: { organizationId }, _count: { status: true } }),
    prisma.activityLog.findMany({
      where: { user: { organizationId } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { lead: { select: { name: true } } }
    })
  ]);

  const wonTotal = statusGroups.find((g) => g.status === LeadStatus.WON)?._count.status ?? 0;
  const conversionRate = leadCount > 0 ? Math.round((wonTotal / leadCount) * 100) : 0;

  const chartData = statuses.map((status) => ({
    name: statusLabels[status],
    leads: statusGroups.find((g) => g.status === status)?._count.status ?? 0
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Pipeline health and recent activity across your workspace."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total leads" value={leadCount} detail="All contacts in CRM" />
        <StatCard title="Open pipeline" value={openCount} detail="Active opportunities" />
        <StatCard title="Won this month" value={wonThisMonth} detail="Closed deals" />
        <StatCard title="Conversion rate" value={`${conversionRate}%`} detail="Won vs total leads" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/[0.06] bg-[#111113]">
          <CardHeader>
            <CardTitle>Pipeline by stage</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-[#111113]">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-sm text-white/45">No activity yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border-b border-white/[0.06] pb-3 last:border-0">
                  <p className="text-sm text-white/80">{log.action}</p>
                  <p className="text-xs text-white/40">
                    {log.lead?.name ? `${log.lead.name} · ` : ""}
                    {formatDate(log.createdAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/[0.06] bg-[#111113]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent leads</CardTitle>
          <Link href="/leads" className="text-sm text-white/50 hover:text-white">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-white/45">No leads yet. Add your first lead from the Leads page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-white/40">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Company</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Priority</th>
                    <th className="pb-3 pr-4 font-medium">Assigned</th>
                    <th className="pb-3 font-medium">Follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/[0.04]">
                      <td className="py-3 pr-4 font-medium">{lead.name}</td>
                      <td className="py-3 pr-4 text-white/60">{lead.company?.name ?? lead.companyName ?? "—"}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="py-3 pr-4">
                        <PriorityBadge priority={lead.priority} />
                      </td>
                      <td className="py-3 pr-4 text-white/60">{lead.assignedTo?.name ?? "Unassigned"}</td>
                      <td className="py-3 text-white/50">{lead.followUpAt ? formatDate(lead.followUpAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
