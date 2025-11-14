import { z } from "zod";

export const publicationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  journal: z
    .string()
    .min(1, "Journal name is required")
    .max(200, "Journal name must be at most 200 characters"),
  publishedAt: z.string().refine(
    (date) => {
      const parsed = Date.parse(date);
      return !isNaN(parsed) && parsed <= Date.now();
    },
    {
      message: "Invalid date format or date cannot be in the future",
    }
  ),
  url: z
    .string()
    .url("Invalid URL format")
    .max(1000, "URL too long")
    .optional()
    .nullable(),
});

export type PublicationInput = z.infer<typeof publicationSchema>;
