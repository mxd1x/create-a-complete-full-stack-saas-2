"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCompanyAction } from "@/actions/companies";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export function DeleteCompanyButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete company</DialogTitle>
          <DialogDescription>Remove {name}? Associated leads will be unlinked.</DialogDescription>
        </DialogHeader>
        <form
          action={(fd) => {
            startTransition(async () => {
              await deleteCompanyAction(fd);
              setOpen(false);
            });
          }}
          className="flex justify-end gap-2"
        >
          <input type="hidden" name="id" value={id} />
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="destructive" disabled={pending}>
            Delete
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
