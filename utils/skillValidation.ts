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
  years: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === "" || val === undefined || val === null) return null;
      const n = Number(val);
      if (Number.isNaN(n) || !Number.isInteger(n) || n < 0 || n > 50) {
        throw new Error("Years must be an integer between 0 and 50");
      }
      return n;
    }),
  iconUrl: z.string().max(1000, "URL too long").nullable().optional(),
  description: z
    .string()
    .max(1000, "Description too long")
    .nullable()
    .optional(),
});

export type SkillInput = z.infer<typeof skillSchema>;
