"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { skillSchema, SkillInput } from "@/utils/skillValidation";

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
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
  });

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/skills/${id}`);
        const result = await res.json();

        if (result.ok && result.skill) {
          const exp = result.skill;

          setValue("level", exp.level);
          setValue("category", exp.category);
          setValue("name", exp.name);
          setValue("years", exp.years || "");
          setValue("iconUrl", exp.iconUrl || "");
          setValue("description", exp.description || "");
          setFetchError("");
        } else {
          setFetchError(result.message || "Failed to fetch skill");
        }
      } catch (err) {
        console.error("Failed to fetch skill:", err);
        setFetchError("Failed to load skill data");
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id, setValue]);

  const onSubmit = async (data: SkillInput) => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Skill updated successfully!");
        router.push("/admin/skills");
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
        <div className="text-lg">Loading skill data...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto">
        <div className="text-red-500 text-center mb-4">{fetchError}</div>
        <button
          onClick={() => router.push("/admin/skills")}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Skills
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Skill</h2>

      <div>
        <label className="block mb-1 font-medium">Skill Name</label>
        <input
          type="text"
          id="name"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          {...register("name")}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Level</label>
          <select
            id="level"
            {...register("level")}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          {errors.level && (
            <p className="text-red-500">{errors.level.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            id="category"
            {...register("category")}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="DATABASE">Database</option>
            <option value="DEVOPS">DevOps</option>
            <option value="MOBILE">Mobile</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Years of Experience</label>
        <input
          type="text"
          id="years"
          {...register("years")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.years && <p className="text-red-500">{errors.years.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Icon URL</label>
        <input
          type="text"
          id="iconUrl"
          {...register("iconUrl")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.iconUrl && (
          <p className="text-red-500">{errors.iconUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          id="description"
          {...register("description")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/skills")}
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Skill"}
        </button>
      </div>
    </form>
  );
}
