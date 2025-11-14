"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProjectInput, projectSchema } from "@/utils/projectValidation";

export default function NewForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: { technologies: [] },
  });

  const [techInput, setTechInput] = useState("");

  const addTechnology = (current: string[], newTech: string) => {
    if (!newTech.trim().toLowerCase()) return current;
    if (current.includes(newTech.toLowerCase())) return current;
    return [...current, newTech.trim().toLowerCase()];
  };

  const removeTechnology = (current: string[], tech: string) => {
    return current.filter((item) => item !== tech);
  };

  const onSubmit = async (data: ProjectInput) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Projrct added successfully!");
        router.push("/admin/projects");
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
      <h2 className="text-2xl font-bold mb-4">Add New Project</h2>

      <div>
        <label className="block mb-1 font-medium">Job Title</label>
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
          {...register("description")}
          id="description"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">RepoURL</label>
        <input
          type="text"
          id="repoUrl"
          {...register("repoUrl")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.repoUrl && (
          <p className="text-red-500">{errors.repoUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">URL</label>
        <input
          type="text"
          id="url"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
