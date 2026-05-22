import { LeadPriority, LeadStatus } from "@prisma/client";

export const statusLabels: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost"
};

export const priorityLabels: Record<LeadPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent"
};

export const statuses = Object.values(LeadStatus);
export const priorities = Object.values(LeadPriority);

export function priorityVariant(priority: LeadPriority) {
  if (priority === "URGENT") return "destructive";
  if (priority === "HIGH") return "default";
  if (priority === "MEDIUM") return "secondary";
  return "outline";
}
