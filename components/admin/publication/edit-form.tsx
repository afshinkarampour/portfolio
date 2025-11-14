"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  publicationSchema,
  PublicationInput,
} from "@/utils/publicationValidation";

interface EditPublicationFormProps {
  id: string;
}

export default function EditPublicationForm({ id }: EditPublicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),
  });

  // Fetch existing publication data
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/publications/${id}`);
        const result = await res.json();

        if (result.ok && result.publication) {
          const pub = result.publication;

          setValue("title", pub.title);
          setValue("journal", pub.journal);
          setValue(
            "publishedAt",
            new Date(pub.publishedAt).toISOString().split("T")[0]
          );
          setValue("url", pub.url || "");
          setFetchError("");
        } else {
          setFetchError(result.message || "Failed to fetch publication");
        }
      } catch (err) {
        console.error("Failed to fetch publication:", err);
        setFetchError("Failed to load publication data");
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id, setValue]);

  // Handle update
  const onSubmit = async (data: PublicationInput) => {
    try {
      const res = await fetch(`/api/publications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Publication updated successfully!");
        router.push("/admin/publications");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="text-lg">Loading publication data...</div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto">
        <div className="text-red-500 text-center mb-4">{fetchError}</div>
        <button
          onClick={() => router.push("/admin/publications")}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Publications
        </button>
      </div>
    );
  }

  // Form UI
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Publication</h2>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
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

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/publications")}
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Publication"}
        </button>
      </div>
    </form>
  );
}
