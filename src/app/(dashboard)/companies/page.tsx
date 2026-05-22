import Link from "next/link";
import { Building2, Pencil } from "lucide-react";
import { PageHeader } from "@/components/crm/page-header";
import { EmptyState } from "@/components/crm/empty-state";
import { CompanyDialog } from "@/components/companies/company-dialog";
import { DeleteCompanyButton } from "@/components/companies/delete-company-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireOrganizationId } from "@/lib/org";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function CompaniesPage() {
  const { organizationId } = await requireOrganizationId();

  const companies = await prisma.company.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
    include: { _count: { select: { leads: true } } }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Accounts"
        title="Companies"
        description="Manage customer accounts and link leads to organizations."
        actions={<CompanyDialog />}
      />

      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Add your first company to organize leads by account."
          action={<CompanyDialog />}
        />
      ) : (
        <Card className="border-white/[0.06] bg-[#111113]">
          <CardContent className="overflow-x-auto pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <p className="font-medium">{company.name}</p>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-white/40 hover:text-white/70"
                        >
                          {company.website}
                        </a>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-white/60">{company.industry ?? "—"}</TableCell>
                    <TableCell className="text-white/60">{company.size ?? "—"}</TableCell>
                    <TableCell>
                      <Link href={`/leads?company=${company.id}`} className="text-sm text-white/70 hover:text-white">
                        {company._count.leads} leads
                      </Link>
                    </TableCell>
                    <TableCell className="text-white/50">{formatDate(company.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <CompanyDialog
                          company={company}
                          trigger={
                            <Button size="icon" variant="ghost">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DeleteCompanyButton id={company.id} name={company.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
