"use client";

import { useState, useEffect } from "react";
import { MdOutlineDownload } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import { ToggleTheme } from "../toggle-theme";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [isVisible, setIsVisible] = useState(true);
  const sections: string[] = ["home", "about", "career", "contact"];
  const activeSection: string = useScrollSpy(sections, 100);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const controllNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controllNavbar);

    return () => window.removeEventListener("scroll", controllNavbar);
  }, []);
  return (
    <nav
      className={`bg-[var(--header)] shadow-md w-screen fixed z-50 px-2 md:px-12 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex items-center w-full justify-between h-30">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-transform hover:scale-105 duration-300"
        >
          <Image
            src={lightLogo}
            height={50}
            alt="logo"
            className="dark:hidden"
          />
          <Image
            src={darkLogo}
            height={50}
            alt="logo"
            className="hidden dark:block"
          />
        </Link>

        {/* Hamburger for mobile */}
        <input id="menu-toggle" type="checkbox" className="hidden peer" />
        <label
          htmlFor="menu-toggle"
          className="flex gap-3 items-center cursor-pointer md:hidden text-gray-700 dark:text-gray-200 text-2xl"
        >
          <span>
            <ToggleTheme />
          </span>
          <span className="peer-checked:hidden">
            <FiMenu />
          </span>
          <span className="hidden peer-checked:inline">
            <FiX />
          </span>
        </label>

        {/* Menu */}
        <ul
          className="flex flex-col justify-around md:items-center gap-4 absolute top-30 left-0 pl-10 w-full shadow-md 
                      max-h-0 overflow-hidden transition-all duration-300 ease-in-out
                      peer-checked:min-h-[300px] bg-[var(--header)] md:peer-checked:max-h-none
                      md:flex md:flex-row md:gap-10 md:justify-end md:pr-6 md:static md:shadow-none md:bg-transparent md:max-h-none"
        >
          {["Home", "About", "Career", "Contact"].map((item) => {
            const sectionId: string = item.toLowerCase();
            const isActive: boolean = activeSection === sectionId;

            return (
              <li key={item}>
                <Link
                  href={`#${sectionId}`}
                  className={`${
                    isActive
                      ? "text-[var(--accent)] font-medium"
                      : "text-[var(--fg-muted)]"
                  } hover:text-[var(--accent)] transition-colors duration-300 relative group`}
                >
                  {item}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--accent)] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
            );
          })}
          <li className="max-w-20">
            <a
              href="/cv.pdf"
              download="Afshin-Karampour-CV.pdf"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[var(--accent)] to-teal-400 text-white hover:from-[var(--accent-hover)] hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              CV
              <MdOutlineDownload size={18} />
            </a>
          </li>
        </ul>

        <div className="hidden md:flex items-center">
          <ToggleTheme />
        </div>
      </div>
    </nav>
  );
}
