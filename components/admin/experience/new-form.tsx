"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  experienceSchema,
  ExperienceInput,
} from "@/utils/experienceValidataion";

export default function NewForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
  });

  const onSubmit = async (data: ExperienceInput) => {
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Experience added successfully!");
        router.push("/admin/experience");
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
      <h2 className="text-2xl font-bold mb-4">Add New Experience</h2>

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
        <label className="block mb-1 font-medium">Company</label>
        <input
          type="text"
          {...register("company")}
          id="company"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.company && (
          <p className="text-red-500">{errors.company.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select
          {...register("type")}
          id="type"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="FULLTIME">Full-time</option>
          <option value="PARTTIME">Part-time</option>
          <option value="FREELANCE">Freelance</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            id="startDate"
            {...register("startDate")}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.startDate && (
            <p className="text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            {...register("endDate")}
            id="endDate"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty if current job
          </p>
          {errors.endDate && (
            <p className="text-red-500">{errors.endDate.message}</p>
          )}
        </div>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Add Experience
      </button>
    </form>
  );
}
