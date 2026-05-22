import { LeadStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { statusLabels } from "@/lib/lead-meta";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-white/20 bg-white/[0.06] text-white/70",
  CONTACTED: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  QUALIFIED: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  PROPOSAL_SENT: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  WON: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  LOST: "border-red-500/30 bg-red-500/10 text-red-200"
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  );
}
