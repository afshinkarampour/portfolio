import z from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  repoUrl: z.string().nullable().optional(),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
