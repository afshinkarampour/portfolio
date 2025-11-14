"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { blogSchema, BlogInput } from "@/utils/blogValidation";

export default function NewForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
  });

  const onSubmit = async (data: BlogInput) => {
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Blog added successfully!");
        router.push("/admin/blog");
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
      className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className="block mb-1 font-medium">Slug</label>
        <input
          type="text"
          {...register("slug")}
          placeholder="example-blog-post"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
      </div>

      {/* Content */}
      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          {...register("content")}
          rows={6}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block mb-1 font-medium">Tags (comma separated)</label>
        <input
          type="text"
          {...register("tags", {
            setValueAs: (v: string) =>
              v
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
          })}
          placeholder="e.g. react, nextjs, webdev"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
      </div>

      {/* PublishedAt */}
      <div>
        <label className="block mb-1 font-medium">Published Date</label>
        <input
          type="date"
          {...register("publishedAt")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.publishedAt && (
          <p className="text-red-500">{errors.publishedAt.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {isSubmitting ? "Adding..." : "Add Blog"}
      </button>
    </form>
  );
}
