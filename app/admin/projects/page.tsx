"use client";

import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmToast } from "@/hooks/useConfirmToast";
import { ProjectInput } from "@/utils/projectValidation";
import axios from "axios";
import Link from "next/link";

type Project = ProjectInput & {
  id: number;
};

export default function ProjectPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data.projects);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const { confirmToast } = useConfirmToast();

  const handleDelete = async (id: number) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this Project?"
    );
    if (!confirmed) return;

    // Optimistic update
    const projectToDelete = projects.find((prj) => prj.id === id);
    setProjects(projects.filter((prj) => prj.id !== id));

    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      // Rollback on error
      if (projectToDelete) {
        setProjects((prev) => [...prev, projectToDelete]);
      }
      toast.error("Failed to delete this project. Please try again.");
    }
  };

  const handleEdit = async (id: number) => {
    setEditingIds((prev) => [...prev, id]);
    try {
      router.push(`/admin/projects/edit/${id}`);
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
        <h1 className="text-xl md:text-3xl font-bold">Project Management</h1>
        <Link
          href="/admin/projects/new"
          className="py-2 px-3 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Add Project
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold mb-1">{proj.title}</h2>
            {proj.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-1 truncate">
                {proj.description}
              </p>
            )}
            {proj.technologies.length > 0 && (
              <p className="text-sm text-gray-400 mb-1">
                {proj.technologies.join(", ")}
              </p>
            )}
            {proj.url && (
              <a
                href={proj.url}
                target="_blank"
                className="text-blue-500 underline mb-1"
              >
                Visit Project
              </a>
            )}
            {proj.repoUrl && (
              <a
                href={proj.repoUrl}
                target="_blank"
                className="text-blue-500 underline mb-1"
              >
                View Repo
              </a>
            )}
            <div className="flex gap-2 justify-end mt-2">
              <button
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                onClick={() => handleEdit(proj.id)}
                disabled={editingIds.includes(proj.id)}
              >
                <Edit className={`w-4 h-4`} />{" "}
                {!editingIds.includes(proj.id) ? "Edit" : "Loading..."}
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(proj.id)}
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No projects found.</p>
      )}
    </div>
  );
}
