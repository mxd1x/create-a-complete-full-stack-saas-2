"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from "@dnd-kit/core";
import { LeadStatus, type Lead, type User } from "@prisma/client";
import { moveLeadStatusAction } from "@/actions/leads";
import { statusLabels, statuses } from "@/lib/lead-meta";
import { PipelineColumn } from "./pipeline-column";

export type KanbanLead = Lead & { assignedTo?: Pick<User, "name"> | null };

export function PipelineBoard({ leads: initialLeads }: { leads: KanbanLead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const leadId = String(active.id);
    const newStatus = over.id as LeadStatus;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus || !statuses.includes(newStatus)) return;

    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    startTransition(() => moveLeadStatusAction(leadId, newStatus));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 overflow-x-auto pb-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statuses.map((status) => (
          <PipelineColumn
            key={status}
            status={status}
            title={statusLabels[status]}
            leads={leads.filter((l) => l.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <div className="w-56 rounded-lg border border-white/15 bg-[#18181b] p-3 shadow-xl">
            <p className="font-medium text-sm">{activeLead.name}</p>
            <p className="mt-1 text-xs text-white/40">{activeLead.companyName ?? "No company"}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
