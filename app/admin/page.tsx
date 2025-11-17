"use client";

import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    skills: 0,
    experiences: 0,
    projects: 0,
    publications: 0,
    blogs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const api = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        });

        const [
          skillsRes,
          experiencesRes,
          projectsRes,
          publicationsRes,
          blogsRes,
        ] = await Promise.all([
          api.get("/skills"),
          api.get("/experiences"),
          api.get("/projects"),
          api.get("/publications"),
          api.get("/blogs"),
        ]);

        setStats({
          skills: skillsRes.data.skills?.length || 0,
          experiences: experiencesRes.data.experiences?.length || 0,
          projects: projectsRes.data.projects?.length || 0,
          publications: publicationsRes.data.publications?.length || 0,
          blogs: blogsRes.data.blogs?.length || 0,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const items = [
    { title: "Skills", count: stats.skills, href: "/admin/skills" },
    {
      title: "Experiences",
      count: stats.experiences,
      href: "/admin/experiences",
    },
    { title: "Projects", count: stats.projects, href: "/admin/projects" },
    {
      title: "Publications",
      count: stats.publications,
      href: "/admin/publications",
    },
    { title: "Blogs", count: stats.blogs, href: "/admin/blogs" },
  ];

  const actions = [
    { label: "Add Skill", href: "/admin/skills/new" },
    { label: "Add Experience", href: "/admin/experiences/new" },
    { label: "Add Project", href: "/admin/projects/new" },
    { label: "Add Publication", href: "/admin/publications/new" },
    { label: "Add Blog", href: "/admin/blogs/new" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-12">
      <h1 className="text-3xl font-bold text-[var(--fg)]">
        Dashboard Overview
      </h1>

      {/* Loading state */}
      {loading && (
        <p className="text-[var(--fg-muted)] text-lg">Loading data...</p>
      )}

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="
                group p-6 rounded-2xl border 
                bg-[var(--card)] shadow-md backdrop-blur 
                transition-all hover:shadow-xl hover:-translate-y-1 
                hover:border-[var(--accent)]
              "
            >
              <h2 className="text-lg font-medium text-[var(--fg-muted)]">
                {item.title}
              </h2>
              <p className="text-4xl font-bold mt-2 text-[var(--fg)] group-hover:text-[var(--accent)]">
                {item.count}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--fg)]">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="
                w-full px-5 py-3 rounded-xl
                bg-gradient-to-r from-[var(--accent)] to-teal-400 
                text-white font-medium text-center 
                shadow-md hover:shadow-lg hover:from-[var(--accent-hover)]
                transition-all
              "
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
