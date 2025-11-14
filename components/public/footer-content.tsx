import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

export default function FooterContent() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-[var(--header)] border-t border-gray-300 dark:border-gray-700 pt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        {/* 🔹 Logo + Short intro */}
        <div>
          <h2 className="text-xl font-bold text-[var(--accent)] tracking-wide">
            Afshin Karampour
          </h2>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Full Stack Developer • MERN & Frontend Developer
          </p>
        </div>

        {/* 🔹 Navigation links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {[
            { name: "Home", href: "#home" },
            { name: "About", href: "#about" },
            { name: "Career", href: "#career" },
            { name: "Contact", href: "#contact" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* 🔹 Social links */}
        <div className="flex justify-center gap-5 text-[var(--fg-muted)]">
          <a
            href="https://github.com/afshinkarampour"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors duration-300"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://linkedin.com/in/afshin-karampour-3a662264"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors duration-300"
          >
            <FaLinkedin size={22} />
          </a>
          <a
            href="afshinkarampour@gmail.com"
            className="hover:text-[var(--accent)] transition-colors duration-300"
          >
            <FaEnvelope size={22} />
          </a>
        </div>
      </div>

      {/* 🔹 Bottom bar */}
      <div className="border-t border-gray-300 dark:border-gray-700 text-center py-4 text-xs text-[var(--fg-muted)]">
        © {currentYear} Afshin Karampour. All rights reserved.
      </div>
    </footer>
  );
}
