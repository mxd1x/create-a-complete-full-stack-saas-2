"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteLeadAction } from "@/actions/leads";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export function DeleteLeadButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" title="Delete lead">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete lead</DialogTitle>
          <DialogDescription>
            Permanently remove <strong className="text-white">{name}</strong>? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(fd) => {
            startTransition(async () => {
              await deleteLeadAction(fd);
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
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
