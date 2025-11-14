import Image from "next/image";

type Skill = {
  id: number;
  name: string;
  iconUrl?: string;
  category?: string;
  level?: string;
  years?: number;
  description?: string;
};

async function getSkills(): Promise<Skill[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch skills:", res.statusText);
    return [];
  }

  const data = await res.json();
  return data.skills || [];
}

export default async function Skills() {
  const skills = await getSkills();

  if (!skills.length) {
    return (
      <section
        id="career"
        className="py-20 bg-[var(--bg)] text-[var(--fg)] flex justify-center"
      >
        <p className="text-[var(--muted)]">No skills found.</p>
      </section>
    );
  }

  return (
    <section
      id="career"
      className="py-20 bg-[var(--bg)] text-[var(--fg)] flex justify-center"
    >
      <div className="max-w-6xl w-full px-6">
        <h2 className="text-3xl font-bold mb-10 text-center text-[var(--accent)]">
          Skills
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="group flex flex-col items-center text-center p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            >
              {skill.iconUrl && (
                <div className="relative w-16 h-16 mb-4">
                  <Image
                    src={skill.iconUrl}
                    alt={skill.name}
                    fill
                    sizes="64px"
                    className="object-contain rounded-md"
                  />
                </div>
              )}

              <h3 className="text-xl font-semibold text-[var(--fg)]">
                {skill.name}
              </h3>

              {(skill.level || skill.category) && (
                <p className="text-sm text-[var(--muted)] mt-1">
                  {skill.level} {skill.category && `• ${skill.category}`}
                </p>
              )}

              {skill.years && (
                <p className="text-xs text-[var(--fg-muted)] mt-1">
                  {skill.years} years
                </p>
              )}

              {skill.description && (
                <p className="text-sm text-[var(--fg-muted)] mt-3 line-clamp-3">
                  {skill.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
