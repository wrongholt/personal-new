"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const sectionIds = ["hero", "books", "projects", "blog", "about"];
const navLabels = ["Home", "Books", "Projects", "Blog", "About"];

const Navigation = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (!isHomePage) {
    return (
      <>
        <nav className="sm:hidden fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50 px-4 py-3">
          <Link href="/" className="text-white font-bold">
            ← Back to Home
          </Link>
        </nav>

        <nav className="hidden sm:flex fixed top-0 left-0 h-screen w-20 flex-col items-center py-8 z-50 bg-transparent pointer-events-none">
          {navLabels.map((item, i) => (
            <Link
              key={i}
              href={`/#${sectionIds[i]}`}
              scroll={true}
              className="group text-white text-sm mb-8 cursor-pointer relative glitch-text pointer-events-auto"
            >
              <span className="relative z-10">{item}</span>
              <span className="absolute inset-0 z-0" aria-hidden="true">
                {item}
              </span>
            </Link>
          ))}
        </nav>
      </>
    );
  }

  // Home page - hide on mobile
  return (
    <nav className="hidden sm:flex fixed top-0 left-0 h-screen w-20 flex-col items-center py-8 z-50 bg-transparent pointer-events-none">
      {navLabels.map((item, i) => (
        <Link
          key={i}
          href={`/#${sectionIds[i]}`}
          scroll={true}
          className="group text-white text-sm mb-8 cursor-pointer relative glitch-text pointer-events-auto"
        >
          <span className="relative z-10">{item}</span>
          <span className="absolute inset-0 z-0" aria-hidden="true">
            {item}
          </span>
        </Link>
      ))}
    </nav>
  );
};
export default Navigation;
