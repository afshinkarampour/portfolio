"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <FaSun className="absolute h-6 w-6 rotate-0 scale-100 dark:-rotate-90 dark:scale-0"></FaSun>
        <FaMoon className="absolute h-6 w-6 rotate-90 scale-0 text-amber-300 dark:-rotate-0 dark:scale-100"></FaMoon>
      </button>
    </>
  );
}
