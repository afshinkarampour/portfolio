export const dynamic = "force-dynamic";

import About from "@/components/public/about";
import Experiences from "@/components/public/experiences";
import Hero from "@/components/public/hero";
import Projects from "@/components/public/projects";
import Publications from "@/components/public/publications";
import Skills from "@/components/public/skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experiences />
      <Projects />
      <Publications />
    </>
  );
}
