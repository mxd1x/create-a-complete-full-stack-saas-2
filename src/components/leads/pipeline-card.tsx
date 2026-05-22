"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PriorityBadge } from "@/components/dashboard/priority-badge";
import { cn } from "@/lib/utils";
import type { KanbanLead } from "./pipeline-board";

export function PipelineCard({ lead }: { lead: KanbanLead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab rounded-lg border border-white/[0.08] bg-[#09090b] p-3 active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <p className="text-sm font-medium">{lead.name}</p>
      <p className="mt-1 text-xs text-white/40">{lead.companyName ?? "No company"}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <PriorityBadge priority={lead.priority} />
        <span className="truncate text-xs text-white/35">{lead.assignedTo?.name ?? "—"}</span>
      </div>
    </div>
  );
}
