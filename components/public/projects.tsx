// app/projects/page.tsx  ✅ Server Component
import React from "react";

interface Project {
  id: number;
  title: string;
  description?: string;
  technologies: string[];
  url?: string;
  repoUrl?: string;
  imageUrl?: string;
}

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch projects");

  const data = await res.json();
  return data.projects || [];
}

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div id="career" className="bg-[var(--bg)] text-[var(--fg)]">
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          My <span className="text-[var(--accent)]">Projects</span>
        </h1>
        {projects.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No projects available yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <article
                key={proj.id}
                className="group bg-white dark:bg-[#0D1B2A] border border-gray-200 dark:border-blue-900/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* تصویر پروژه (اختیاری) */}
                {proj.imageUrl && (
                  <div className="overflow-hidden">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {/* متن پروژه */}
                <div className="p-5 flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {proj.title}
                  </h2>
                  {proj.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex justify-between items-center">
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      >
                        Live Demo
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 text-sm font-medium"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
