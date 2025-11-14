import Image from "next/image";

import profile from "@/public/profile.jpg";
import TextCarousel from "./text-carousel";

export default function About() {
  return (
    <div
      id="about"
      className="w-screen min-h-[480px] bg-[var(--bg)] text-[var(--fg)] pb-[50px] flex justify-center px-4"
    >
      <div className="flex flex-col items-center gap-6 bg-gradient-to-r from-[#0F172A] via-[#344f8d] to-[#0f172a] max-w-3xl w-full pt-8 pb-10 rounded-2xl md:px-0 border border-[var(--border)] shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="border border-[var(--border)] rounded-lg p-2 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
          <div className="relative overflow-hidden bg-cover bg-[50%] bg-no-repeat rounded-md">
            <Image
              height="300"
              width="250"
              className="z-20 border border-[var(--muted)] rounded-md object-cover"
              src={profile}
              alt="profile pic"
            />
            <div className="hidden md:block absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[var(--overlay)] bg-fixed opacity-50 hover:opacity-0 transition-all duration-300 ease-in-out"></div>
          </div>
        </div>
        <div className="w-full px-6">
          <TextCarousel />
        </div>
      </div>
    </div>
  );
}
