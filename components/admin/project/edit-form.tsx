"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProjectInput, projectSchema } from "@/utils/projectValidation";

interface EditProjectFormProps {
  id: string;
}

export default function EditForm({ id }: EditProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [techInput, setTechInput] = useState("");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: { technologies: [] },
  });

  // 🧠 Helpers for technologies
  const addTechnology = (current: string[], newTech: string) => {
    if (!newTech.trim().toLowerCase()) return current;
    if (current.includes(newTech.toLowerCase())) return current;
    return [...current, newTech.trim().toLowerCase()];
  };

  const removeTechnology = (current: string[], tech: string) =>
    current.filter((item) => item !== tech);

  // 🌀 Fetch existing project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${id}`);
        const result = await res.json();

        if (result.ok && result.project) {
          const p = result.project;
          setValue("title", p.title);
          setValue("description", p.description || "");
          setValue("repoUrl", p.repoUrl || "");
          setValue("url", p.url || "");
          setValue("technologies", p.technologies || []);
          setFetchError("");
        } else {
          setFetchError(result.message || "Failed to fetch project");
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setFetchError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, setValue]);

  // 💾 Update Project
  const onSubmit = async (data: ProjectInput) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Project updated successfully!");
        router.push("/admin/projects");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="text-lg">Loading project data...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto">
        <div className="text-red-500 text-center mb-4">{fetchError}</div>
        <button
          onClick={() => router.push("/admin/projects")}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>

      <div>
        <label className="block mb-1 font-medium">Project Title</label>
        <input
          type="text"
          id="title"
          {...register("title")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Repository URL</label>
        <input
          id="repoUrl"
          type="text"
          {...register("repoUrl")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.repoUrl && (
          <p className="text-red-500">{errors.repoUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Live URL</label>
        <input
          id="url"
          type="text"
          {...register("url")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.url && <p className="text-red-500">{errors.url.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Technologies</label>
        <Controller
          name="technologies"
          control={control}
          render={({ field }) => (
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const updated = addTechnology(field.value, techInput);
                      field.onChange(updated);
                      setValue("technologies", updated);
                      setTechInput("");
                    }
                  }}
                  placeholder="Add a technology"
                  className="flex-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = addTechnology(field.value, techInput);
                    field.onChange(updated);
                    setValue("technologies", updated);
                    setTechInput("");
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((tech, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      className="text-red-500 font-bold cursor-pointer"
                      onClick={() => {
                        const updated = removeTechnology(field.value, tech);
                        field.onChange(updated);
                        setValue("technologies", updated);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        />
        {errors.technologies && (
          <p className="text-red-500">{errors.technologies.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Project"}
        </button>
      </div>
    </form>
  );
}
