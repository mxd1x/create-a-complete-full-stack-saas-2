import { LeadPriority } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { priorityLabels } from "@/lib/lead-meta";

const priorityStyles: Record<LeadPriority, string> = {
  LOW: "border-white/15 bg-white/[0.03] text-white/50",
  MEDIUM: "border-white/20 bg-white/[0.05] text-white/65",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  URGENT: "border-red-500/30 bg-red-500/10 text-red-200"
};

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  return (
    <Badge variant="outline" className={priorityStyles[priority]}>
      {priorityLabels[priority]}
    </Badge>
  );
}
