"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "RAGE FEED", href: "/" },
  { label: "WALL OF SHAME", href: "/wall" },
  { label: "SUBMIT FUCK", href: "/submit" },
  { label: "API", href: "/api-docs" },
];

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center bg-cream border-2 border-red rounded-full px-1 py-1 gap-0.5 shadow-lg">
        <a
          href="https://github.com/Rahat-ch/forfucksake"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2.5 rounded-full text-xs font-bold tracking-wide text-red hover:bg-pink-light transition-colors"
          title="GitHub"
        >
          GH
        </a>
        <div className="w-px h-5 bg-red/20" />
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-red text-cream"
                  : "text-red hover:bg-pink-light"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
