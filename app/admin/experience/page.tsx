"use client";

import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmToast } from "@/hooks/useConfirmToast";
import { ExperienceInput } from "@/utils/experienceValidataion";
import axios from "axios";
import Link from "next/link";

type Experience = ExperienceInput & {
  id: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function ExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.get("/experiences");
      setExperiences(res.data.experiences);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const { confirmToast } = useConfirmToast();

  const handleDelete = async (id: number) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this experience?"
    );
    if (!confirmed) return;

    // Optimistic update
    const experienceToDelete = experiences.find((exp) => exp.id === id);
    setExperiences(experiences.filter((exp) => exp.id !== id));

    try {
      await api.delete(`/experiences/${id}`);
    } catch (err) {
      console.error(err);
      // Rollback on error
      if (experienceToDelete) {
        setExperiences((prev) => [...prev, experienceToDelete]);
      }
      toast.success("Failed to delete experience. Please try again.");
    }
  };

  const handleEdit = async (id: number) => {
    setEditingIds((prev) => [...prev, id]);
    try {
      router.push(`/admin/experience/edit/${id}`);
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
        <h1 className="text-xl md:text-3xl font-bold">Experience Management</h1>
        <Link
          href="/admin/experience/new"
          className="py-2 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Add Experience
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold mb-1">{exp.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {exp.company}
            </p>
            <p className="text-sm text-gray-400 mb-1">{exp.type}</p>
            <p className="text-sm text-gray-400 mb-1">
              {new Date(exp.startDate).toLocaleDateString()} -{" "}
              {exp.endDate
                ? new Date(exp.endDate).toLocaleDateString()
                : "Present"}
            </p>
            {exp.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-2 truncate">
                {exp.description}
              </p>
            )}
            <div className="flex gap-2 justify-end mt-2">
              <button
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition disabled:opacity-50"
                onClick={() => handleEdit(exp.id)}
                disabled={editingIds.includes(exp.id)}
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(exp.id)}
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {experiences.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No experiences found.</p>
      )}
    </div>
  );
}
