"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { Company, Lead, User } from "@prisma/client";
import { PriorityBadge } from "@/components/dashboard/priority-badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteLeadButton } from "./delete-lead-button";
import { LeadDialog } from "./lead-dialog";
import { formatDate } from "@/lib/utils";

export type LeadRow = Lead & {
  company?: Company | null;
  assignedTo?: User | null;
};

export function LeadsTable({
  leads,
  companies,
  members
}: {
  leads: LeadRow[];
  companies: Pick<Company, "id" | "name">[];
  members: Pick<User, "id" | "name">[];
}) {
  if (leads.length === 0) {
    return <p className="py-12 text-center text-sm text-white/45">No leads match your filters.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assigned</TableHead>
          <TableHead>Follow-up</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.name}</TableCell>
            <TableCell className="text-white/60">{lead.email ?? "—"}</TableCell>
            <TableCell className="text-white/60">{lead.phone ?? "—"}</TableCell>
            <TableCell className="text-white/60">{lead.company?.name ?? lead.companyName ?? "—"}</TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell>
              <PriorityBadge priority={lead.priority} />
            </TableCell>
            <TableCell className="text-white/60">{lead.assignedTo?.name ?? "—"}</TableCell>
            <TableCell className="text-white/50">{lead.followUpAt ? formatDate(lead.followUpAt) : "—"}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <LeadDialog
                  lead={lead}
                  companies={companies}
                  members={members}
                  trigger={
                    <Button size="icon" variant="ghost" title="Edit lead">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <DeleteLeadButton id={lead.id} name={lead.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function LeadsPagination({
  page,
  totalPages,
  searchParams
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  function href(p: number) {
    const next = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) next.set(k, v);
    });
    if (p > 1) next.set("page", String(p));
    const q = next.toString();
    return q ? `/leads?${q}` : "/leads";
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-white/50">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" disabled={page <= 1}>
          <Link href={href(Math.max(1, page - 1))}>Previous</Link>
        </Button>
        <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
          <Link href={href(Math.min(totalPages, page + 1))}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
