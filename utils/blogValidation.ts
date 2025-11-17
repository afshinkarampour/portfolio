import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and dashes"
    ),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .nonempty("At least one tag is required"),
  publishedAt: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
});

export type BlogInput = z.infer<typeof blogSchema>;
