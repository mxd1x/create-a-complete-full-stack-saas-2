import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v : undefined))
    .refine((v) => !v || /^https?:\/\/.+/.test(v), "Enter a valid URL"),
  industry: z.string().optional(),
  size: z.string().optional()
});

export type CompanyFormValues = z.infer<typeof companySchema>;
