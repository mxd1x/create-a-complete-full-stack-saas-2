"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LeadStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import type { KanbanLead } from "./pipeline-board";
import { PipelineCard } from "./pipeline-card";

export function PipelineColumn({
  status,
  title,
  leads
}: {
  status: LeadStatus;
  title: string;
  leads: KanbanLead[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-64 flex-col rounded-xl border border-white/[0.06] bg-[#111113] transition-colors",
        isOver && "border-white/20 bg-[#141416]"
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">{leads.length}</span>
      </div>
      <div className="space-y-2 p-3">
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <PipelineCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        {leads.length === 0 && <p className="py-4 text-center text-xs text-white/30">Drop leads here</p>}
      </div>
    </div>
  );
}
