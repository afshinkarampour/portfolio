import Link from "next/link";

export default function Hero() {
  return (
    <div
      id="home"
      className="w-screen bg-[var(--bg)] text-[var(--fg)] pt-[145px] pb-[50px] flex justify-center"
    >
      <div className="flex flex-col gap-8 max-w-7xl w-full px-5 md:px-0 items-center text-center">
        <p className="text-lg md:text-xl text-[var(--muted)] animate-fade-in">
          Hi there, my name is
        </p>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="text-amber-400 drop-shadow-md">A</span>
          <span className="text-4xl md:text-6xl bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            FSHIN
          </span>{" "}
          <span className="text-teal-400 drop-shadow-md">K</span>
          <span className="text-4xl md:text-6xl bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            ARAMPOUR
          </span>
        </h1>

        <h2 className="text-2xl md:text-4xl text-[var(--muted)] font-medium mt-4">
          <span className="bg-gradient-to-r from-[var(--accent)] to-teal-300 bg-clip-text text-transparent">
            Fullstack JavaScript Developer
          </span>
        </h2>

        <p className="text-md md:text-lg text-[var(--fg-muted)] max-w-3xl leading-relaxed mt-6">
          Specialized in building scalable and secure web applications using
          React, Node.js, and modern JavaScript tools.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="#experience"
            className="px-6 py-3 rounded-lg font-medium cursor-pointer bg-gradient-to-r from-[var(--accent)] to-teal-400 text-white hover:from-[var(--accent-hover)] hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View My Work
          </Link>
          <Link
            href={`#contact`}
            className="border border-[var(--border)] text-[var(--fg)] px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-[var(--btn-sec-bg)] transition-colors"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </div>
  );
}
