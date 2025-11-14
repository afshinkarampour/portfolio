"use client";

import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmToast } from "@/hooks/useConfirmToast";
import { SkillInput } from "@/utils/skillValidation";
import axios from "axios";
import Link from "next/link";

type Skill = SkillInput & {
  id: number;
};

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.get("/skills");
      setSkills(res.data.skills);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const { confirmToast } = useConfirmToast();

  const handleDelete = async (id: number) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this Skill?"
    );
    if (!confirmed) return;

    // Optimistic update
    const skillToDelete = skills.find((skl) => skl.id === id);
    setSkills(skills.filter((skl) => skl.id !== id));

    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter((skill) => skill.id !== id));
    } catch (err) {
      console.error(err);
      // Rollback on error
      if (skillToDelete) {
        setSkills((prev) => [...prev, skillToDelete]);
      }
      toast.success("Failed to delete this skill. Please try again.");
    }
  };

  const handleEdit = async (id: number) => {
    setEditingIds((prev) => [...prev, id]);
    try {
      router.push(`/admin/skills/edit/${id}`);
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
        <h1 className="text-xl md:text-3xl font-bold">Skills Management</h1>
        <Link
          href="/admin/skills/new"
          className="py-2 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Add Skill
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              {skill.iconUrl && (
                <img
                  src={skill.iconUrl}
                  alt={skill.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold">{skill.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {skill.level} - {skill.category}
                </p>
                {skill.years !== undefined && (
                  <p className="text-sm text-gray-400">{skill.years} years</p>
                )}
              </div>
            </div>
            {skill.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-3 truncate">
                {skill.description}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition disabled:opacity-50"
                onClick={() => handleEdit(skill.id)}
                disabled={editingIds.includes(skill.id)}
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(skill.id)}
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No skills found.</p>
      )}
    </div>
  );
}
