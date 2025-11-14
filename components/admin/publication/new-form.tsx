"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  publicationSchema,
  PublicationInput,
} from "@/utils/publicationValidation";

export default function NewPublicationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),
  });

  const onSubmit = async (data: PublicationInput) => {
    try {
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Publication added successfully!");
        router.push("/admin/publications");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Publication</h2>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., Privacy in Smart Grids"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Journal */}
      <div>
        <label className="block mb-1 font-medium">Journal</label>
        <input
          type="text"
          {...register("journal")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., IEEE Transactions on Smart Grid"
        />
        {errors.journal && (
          <p className="text-red-500 text-sm">{errors.journal.message}</p>
        )}
      </div>

      {/* Published Date */}
      <div>
        <label className="block mb-1 font-medium">Published Date</label>
        <input
          type="date"
          {...register("publishedAt")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.publishedAt && (
          <p className="text-red-500 text-sm">{errors.publishedAt.message}</p>
        )}
      </div>

      {/* URL */}
      <div>
        <label className="block mb-1 font-medium">URL (optional)</label>
        <input
          type="url"
          {...register("url")}
          placeholder="https://example.com/publication"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.url && (
          <p className="text-red-500 text-sm">{errors.url.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting ? "Saving..." : "Add Publication"}
      </button>
    </form>
  );
}
