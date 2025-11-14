export const revalidate = 3600;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

async function getPublications() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publications`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch publications");
  }

  const data = await res.json();
  return data.publications;
}

export default async function Publications() {
  const publications = await getPublications();

  if (!publications?.length) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        No publications found.
      </div>
    );
  }

  return (
    <div id="career" className="bg-[var(--bg)] text-[var(--fg)]">
      <section className="py-16 px-4 md:px-12 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--accent)]">
          Publications
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {publications.map((pub: any) => (
            <div
              key={pub.id}
              className="group relative bg-white/80 dark:bg-gray-800/70
                           backdrop-blur-md border border-gray-200/40
                           dark:border-gray-700/50 rounded-2xl shadow-md
                           hover:shadow-lg transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {pub.journal}
                </p>
                {pub.publishedAt && (
                  <p className="text-xs mt-1 text-gray-400">
                    Published: {formatDate(pub.publishedAt)}
                  </p>
                )}
              </div>
              {pub.description && (
                <p className="text-sm mt-4 text-gray-600 dark:text-gray-300 line-clamp-3">
                  {pub.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
