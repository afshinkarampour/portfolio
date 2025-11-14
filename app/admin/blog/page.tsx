"use client";

import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmToast } from "@/hooks/useConfirmToast";
import { BlogInput } from "@/utils/blogValidation";
import axios from "axios";
import Link from "next/link";

type Blog = BlogInput & {
  id: number;
};

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs");
      setBlogs(res.data.blogs);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const { confirmToast } = useConfirmToast();

  const handleDelete = async (id: number) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmed) return;

    // Optimistic update
    const blogToDelete = blogs.find((blg) => blg.id === id);
    setBlogs(blogs.filter((blg) => blg.id !== id));

    try {
      await api.delete(`/blogs/${id}`);
    } catch (err) {
      console.error(err);
      // Rollback on error
      if (blogToDelete) {
        setBlogs((prev) => [...prev, blogToDelete]);
      }
      toast.success("Failed to delete blog. Please try again.");
    }
  };

  const handleEdit = async (id: number) => {
    setEditingIds((prev) => [...prev, id]);
    try {
      router.push(`/admin/blog/edit/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setEditingIds((prev) => prev.filter((editingId) => editingId !== id));
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

  return (
    <div className="py-6 px-2 md:py-6">
      <div className="h-[80px] flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
        <h1 className="text-xl md:text-3xl font-bold">Blog Management</h1>
        <Link
          href="/admin/blog/new"
          className="py-2 px-3 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Add Blog
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              {blog.slug}
            </p>
            {blog.tags.length > 0 && (
              <p className="text-sm text-gray-400 mb-2">
                {blog.tags.join(", ")}
              </p>
            )}
            {blog.publishedAt && (
              <p className="text-sm text-gray-400 mb-2">
                Published: {new Date(blog.publishedAt).toLocaleDateString()}
              </p>
            )}
            <div className="flex gap-2 justify-end mt-2">
              <button
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                onClick={() => handleEdit(blog.id)}
                disabled={editingIds.includes(blog.id)}
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(blog.id)}
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No blogs found.</p>
      )}
    </div>
  );
}
