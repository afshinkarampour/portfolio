"use client";

import React from "react";
import { usePathname } from "next/navigation";
import FooterContent from "./footer-content";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <FooterContent />;
}
