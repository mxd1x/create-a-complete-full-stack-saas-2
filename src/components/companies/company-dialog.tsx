"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import type { Company } from "@prisma/client";
import { createCompanyAction, updateCompanyAction } from "@/actions/companies";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const sizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

export function CompanyDialog({
  company,
  trigger
}: {
  company?: Company;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(company);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            Add company
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit company" : "Add company"}</DialogTitle>
        </DialogHeader>
        <form
          action={(fd) => {
            startTransition(async () => {
              if (isEdit) await updateCompanyAction(fd);
              else await createCompanyAction(fd);
              setOpen(false);
            });
          }}
          className="grid gap-4"
        >
          {company && <input type="hidden" name="id" value={company.id} />}
          <div className="space-y-2">
            <Label htmlFor="name">Company name</Label>
            <Input id="name" name="name" defaultValue={company?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" defaultValue={company?.website ?? ""} placeholder="https://" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" defaultValue={company?.industry ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Company size</Label>
            <Select id="size" name="size" defaultValue={company?.size ?? ""}>
              <option value="">Select size</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
