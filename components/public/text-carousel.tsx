"use client";

import { useEffect, useState } from "react";

const TEXTS = [
  "Creative UI/UX design for modern web apps",
  "Full-stack web development (frontend + backend)",
  "Secure authentication & authorization",
  "Custom admin dashboards with analytics",
  "Fully responsive across devices",
  "Design modular and reusable components",
];

export default function TextCarousel() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TEXTS.length);
        setShow(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex gap-1.5 px-3 items-center justify-around">
      <div className="hidden h-14 w-[20%] md:grid grid-cols-2 grid-rows-1 gap-2">
        <div className="bg-amber-400 rounded-full rounded-br-full"></div>
        <div className="bg-teal-400 rounded-full rounded-bl-full"></div>
      </div>
      <div
        className="relative h-16 w-full md:w-[80%] overflow-hidden rounded-lg bg-[#f1f5f9] dark:bg-[#1e293b]/80 backdrop-blur-sm 
                border border-[var(--border)] flex items-center justify-center"
      >
        <p
          key={index}
          className={`absolute px-0 md:px-4 text-lg font-medium text-[var(--fg)] transition-opacity duration-500 ease-in-out ${
            show ? "opacity-100" : "opacity-0"
          }`}
        >
          {TEXTS[index]}
        </p>
      </div>
      <div className="hidden bg-inherit h-14  w-[20%] md:grid grid-cols-1 grid-rows-2 gap-2">
        <div className="bg-amber-400 rounded-full rounded-br-full"></div>
        <div className="bg-teal-400 rounded-full rounded-bl-full"></div>
      </div>
    </div>
  );
}
