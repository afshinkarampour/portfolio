"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { skillSchema, SkillInput } from "@/utils/skillValidation";

export default function NewForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillInput>({ resolver: zodResolver(skillSchema) });

  const onSubmit = async (data: SkillInput) => {
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Skill added successfully!");
        router.push("/admin/skills");
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
      <h2 className="text-2xl font-bold mb-4">Add New Skill</h2>

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

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {isSubmitting ? "Adding..." : "Add Skill"}
      </button>
    </form>
  );
}
