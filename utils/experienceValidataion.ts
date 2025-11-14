import { z } from "zod";

export const experienceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(200, "Company must be at most 200 characters"),
  type: z.enum(["FULLTIME", "PARTTIME", "FREELANCE", "INTERNSHIP"], {
    message: "Invalid experience type",
  }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  endDate: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
  description: z
    .string()
    .max(1000, "Description too long")
    .nullable()
    .optional(),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
