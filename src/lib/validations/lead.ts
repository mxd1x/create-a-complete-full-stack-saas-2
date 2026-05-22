import { LeadPriority, LeadStatus } from "@prisma/client";
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, "Invalid email"),
  phone: z.string().optional(),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(LeadPriority).optional(),
  assignedToId: z.string().optional(),
  followUpAt: z.string().optional(),
  tags: z.string().optional()
});

export type LeadFormValues = z.infer<typeof leadSchema>;
