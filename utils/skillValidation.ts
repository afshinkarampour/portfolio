import { z } from "zod";

export const skillSchema = z.object({
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"], {
    message: "Invalid level type",
  }),
  category: z.enum(
    ["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE", "OTHER"],
    {
      message: "Invalid category type",
    }
  ),
  name: z
    .string()
    .min(1, "Skills name is required")
    .max(200, "Skills name must be at most 200 characters"),
  years: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  }, z.number().int().min(0).max(50).nullable()),
  iconUrl: z.string().max(1000, "URL too long").nullable().optional(),
  description: z
    .string()
    .max(1000, "Description too long")
    .nullable()
    .optional(),
});

export type SkillInput = z.infer<typeof skillSchema>;
