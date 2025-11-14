"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { blogSchema, BlogInput } from "@/utils/blogValidation";

interface EditFormProps {
  id: string;
}

export default function EditForm({ id }: EditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        const result = await res.json();

        if (result.ok && result.blog) {
          const blog = result.blog;
          setValue("title", blog.title);
          setValue("slug", blog.slug);
          setValue("content", blog.content);
          setValue("tags", blog.tags || []);
          setValue(
            "publishedAt",
            blog.publishedAt
              ? new Date(blog.publishedAt).toISOString().split("T")[0]
              : ""
          );
          setFetchError("");
        } else {
          setFetchError(result.message || "Failed to fetch blog");
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setFetchError("Failed to load blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, setValue]);

  const onSubmit = async (data: BlogInput) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Blog updated successfully!");
        router.push("/admin/blog");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-6">
        <div className="text-lg">Loading blog data...</div>
      </div>
    );

  if (fetchError)
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto">
        <div className="text-red-500 text-center mb-4">{fetchError}</div>
        <button
          onClick={() => router.push("/admin/blog")}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Blogs
        </button>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

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
            setValueAs: (v: any) =>
              typeof v === "string"
                ? v
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : Array.isArray(v)
                ? v
                : [],
          })}
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

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </form>
  );
}
