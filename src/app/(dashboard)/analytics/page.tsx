import { LeadStatus } from "@prisma/client";
import { EmployeePerformanceChart, SalesGrowthChart } from "@/components/analytics/analytics-charts";
import { PageHeader } from "@/components/crm/page-header";
import { StatCard } from "@/components/crm/stat-card";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabels, statuses } from "@/lib/lead-meta";
import { requireOrganizationId } from "@/lib/org";
import { prisma } from "@/lib/prisma";

function getWeekLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AnalyticsPage() {
  const { organizationId } = await requireOrganizationId();

  const [leadCount, wonCount, statusGroups, wonLeads, members] = await Promise.all([
    prisma.lead.count({ where: { organizationId } }),
    prisma.lead.count({ where: { organizationId, status: LeadStatus.WON } }),
    prisma.lead.groupBy({ by: ["status"], where: { organizationId }, _count: { status: true } }),
    prisma.lead.findMany({
      where: { organizationId, status: LeadStatus.WON },
      select: { updatedAt: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.user.findMany({
      where: { organizationId },
      select: { id: true, name: true }
    })
  ]);

  const conversionRate = leadCount > 0 ? Math.round((wonCount / leadCount) * 100) : 0;

  const chartData = statuses.map((status) => ({
    name: statusLabels[status],
    leads: statusGroups.find((g) => g.status === status)?._count.status ?? 0
  }));

  const weeks: { week: string; won: number; start: Date }[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - i * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    weeks.push({ week: getWeekLabel(start), won: 0, start });
    const idx = weeks.length - 1;
    wonLeads.forEach((lead) => {
      if (lead.updatedAt >= start && lead.updatedAt < end) weeks[idx].won += 1;
    });
  }

  const salesGrowth = weeks.map(({ week, won }) => ({ week, won }));

  const employeeStats = await Promise.all(
    members.map(async (member) => {
      const [won, open] = await Promise.all([
        prisma.lead.count({
          where: { organizationId, assignedToId: member.id, status: LeadStatus.WON }
        }),
        prisma.lead.count({
          where: {
            organizationId,
            assignedToId: member.id,
            status: { notIn: [LeadStatus.WON, LeadStatus.LOST] }
          }
        })
      ]);
      return { name: member.name ?? "Unknown", won, open };
    })
  );

  const prevMonthWon = wonLeads.filter((l) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return l.updatedAt >= d && l.updatedAt < new Date();
  }).length;
  const growthPct = prevMonthWon > 0 ? Math.round(((wonCount - prevMonthWon) / prevMonthWon) * 100) : wonCount > 0 ? 100 : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Conversion metrics, sales growth, and team performance."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total leads" value={leadCount} />
        <StatCard title="Conversions" value={`${conversionRate}%`} detail="Won / total" />
        <StatCard title="Won deals" value={wonCount} />
        <StatCard title="Sales growth" value={`${growthPct >= 0 ? "+" : ""}${growthPct}%`} detail="vs prior month" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-white/[0.06] bg-[#111113]">
          <CardHeader>
            <CardTitle>Pipeline distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-[#111113]">
          <CardHeader>
            <CardTitle>Sales growth (weekly wins)</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesGrowthChart data={salesGrowth} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/[0.06] bg-[#111113]">
        <CardHeader>
          <CardTitle>Employee performance</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeePerformanceChart data={employeeStats} />
        </CardContent>
      </Card>
    </div>
  );
}
