"use client";

import { useState, useTransition } from "react";
import { LeadPriority, LeadStatus, type Company, type Lead, type User } from "@prisma/client";
import { Plus } from "lucide-react";
import { createLeadAction, updateLeadAction } from "@/actions/leads";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { priorityLabels, priorities, statusLabels, statuses } from "@/lib/lead-meta";

type LeadWithRelations = Lead & {
  company?: Company | null;
  assignedTo?: User | null;
};

export function LeadDialog({
  lead,
  companies,
  members,
  trigger
}: {
  lead?: LeadWithRelations;
  companies: Pick<Company, "id" | "name">[];
  members: Pick<User, "id" | "name">[];
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(lead);

  const defaultFollowUp = lead?.followUpAt
    ? new Date(lead.followUpAt).toISOString().slice(0, 10)
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            Add lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit lead" : "Add lead"}</DialogTitle>
        </DialogHeader>
        <form
          action={(fd) => {
            startTransition(async () => {
              if (isEdit) await updateLeadAction(fd);
              else await createLeadAction(fd);
              setOpen(false);
            });
          }}
          className="grid gap-4"
        >
          {lead && <input type="hidden" name="id" value={lead.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={lead?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={lead?.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={lead?.phone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyId">Company</Label>
              <Select id="companyId" name="companyId" defaultValue={lead?.companyId ?? ""}>
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Or company name</Label>
              <Input id="companyName" name="companyName" defaultValue={lead?.companyName ?? ""} placeholder="If not in list" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={lead?.status ?? LeadStatus.NEW}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" name="priority" defaultValue={lead?.priority ?? LeadPriority.MEDIUM}>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {priorityLabels[p]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedToId">Assigned to</Label>
              <Select id="assignedToId" name="assignedToId" defaultValue={lead?.assignedToId ?? ""}>
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUpAt">Follow-up date</Label>
              <Input id="followUpAt" name="followUpAt" type="date" defaultValue={defaultFollowUp} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" defaultValue={lead?.tags?.join(", ") ?? ""} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={lead?.notes ?? ""} rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save changes" : "Create lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
