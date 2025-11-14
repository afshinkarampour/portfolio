"use client";

import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmToast } from "@/hooks/useConfirmToast";
import { PublicationInput } from "@/utils/publicationValidation";
import axios from "axios";
import Link from "next/link";

type Publication = PublicationInput & {
  id: number;
};

export default function PublicationPage() {
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/publications");
      setPublications(res.data.publications);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const { confirmToast } = useConfirmToast();

  const handleDelete = async (id: number) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this Publication?"
    );
    if (!confirmed) return;

    // Optimistic update
    const publicationToDelete = publications.find((pub) => pub.id === id);
    setPublications(publications.filter((pub) => pub.id !== id));

    try {
      await api.delete(`/publications/${id}`);
    } catch (err) {
      console.error(err);
      // Rollback on error
      if (publicationToDelete) {
        setPublications((prev) => [...prev, publicationToDelete]);
      }
      toast.success("Failed to delete publication. Please try again.");
    }
  };

  const handleEdit = async (id: number) => {
    setEditingIds((prev) => [...prev, id]);
    try {
      router.push(`/admin/publications/edit/${id}`);
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
        <h1 className="text-xl md:text-3xl font-bold">
          Publication Management
        </h1>
        <Link
          href="/admin/publications/new"
          className="py-2 px-3 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Add Publication
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {publications.map((pub) => (
          <div
            key={pub.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold mb-2">{pub.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
              {pub.journal}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Published: {new Date(pub.publishedAt).toLocaleDateString()}
            </p>
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                className="text-blue-500 underline mb-2"
              >
                View Publication
              </a>
            )}
            <div className="flex gap-2 justify-end mt-2">
              <button
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                onClick={() => handleEdit(pub.id)}
                disabled={editingIds.includes(pub.id)}
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(pub.id)}
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {publications.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No publications found.</p>
      )}
    </div>
  );
}
