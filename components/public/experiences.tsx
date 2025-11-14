import React from "react";

interface Experience {
  id: string;
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
}

async function getExperiences(): Promise<Experience[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experiences`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch experiences");
  const data = await res.json();
  return data.experiences || [];
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function Experiences() {
  const experiences = await getExperiences();

  return (
    <div id="career" className="bg-[var(--bg)] text-[var(--fg)]">
      <section id="experience" className="relative max-w-3xl mx-auto py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          <span className="text-[var(--accent)]">Experiences</span>
        </h1>
        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-blue-500/60 dark:bg-blue-400/60"></div>
        <div className="flex flex-col gap-10 pl-14">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="relative bg-white dark:bg-[#0D1B2A] rounded-2xl p-6 shadow-md border border-gray-200 dark:border-blue-900/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20"
            >
              <span className="absolute left-[-44px] top-8 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-white dark:ring-[#0D1B2A]"></span>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-300">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {exp.company}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">{exp.type}</p>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(exp.startDate)} –{" "}
                  {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
