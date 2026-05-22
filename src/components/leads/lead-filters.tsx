"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { LeadPriority, LeadStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { priorityLabels, priorities, statusLabels, statuses } from "@/lib/lead-meta";

export function LeadFilters({
  companies,
  members
}: {
  companies: { id: string; name: string }[];
  members: { id: string; name: string | null }[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    const q = String(fd.get("q") ?? "").trim();
    if (q) next.set("q", q);
    ["status", "priority", "assignee", "company"].forEach((key) => {
      const val = String(fd.get(key) ?? "");
      if (val) next.set(key, val);
    });
    router.push(`/leads?${next.toString()}`);
  }

  return (
    <form onSubmit={apply} className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
      <Input
        name="q"
        placeholder="Search name, email, company..."
        defaultValue={params.get("q") ?? ""}
        className="lg:col-span-2"
      />
      <Select name="status" defaultValue={params.get("status") ?? ""}>
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s as LeadStatus]}
          </option>
        ))}
      </Select>
      <Select name="priority" defaultValue={params.get("priority") ?? ""}>
        <option value="">All priorities</option>
        {priorities.map((p) => (
          <option key={p} value={p}>
            {priorityLabels[p as LeadPriority]}
          </option>
        ))}
      </Select>
      <Select name="assignee" defaultValue={params.get("assignee") ?? ""}>
        <option value="">All assignees</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </Select>
      <Select name="company" defaultValue={params.get("company") ?? ""}>
        <option value="">All companies</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Button type="submit" className="w-full">
        <Search className="h-4 w-4" />
        Filter
      </Button>
    </form>
  );
}
