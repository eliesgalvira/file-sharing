"use client";

import { usePathname } from "next/navigation";
import { IntentLink } from "~/components/intent-link";
import { uploadKinds } from "~/lib/site-data";

export function ShellSidebarNav() {
  const pathname = usePathname();
  const activeSlug = pathname === "/" ? null : pathname.slice(1);

  return (
    <nav className="space-y-1">
      <IntentLink
        href="/"
        active={pathname === "/"}
        className={`${pathname === "/" ? "border border-[#b67445] bg-[#2b241e] text-[#f7efe5]" : "border border-transparent text-[#b9ada0] hover:border-[#4f463e] hover:bg-[#26211d]"} block rounded-[8px] px-3 py-2 text-sm transition-colors`}
      >
        Overview
      </IntentLink>
      {uploadKinds.map((entry) => (
        <IntentLink
          key={entry.slug}
          href={`/${entry.slug}`}
          active={activeSlug === entry.slug}
          className={`${activeSlug === entry.slug ? "border border-[#b67445] bg-[#2b241e] text-[#f7efe5]" : "border border-transparent text-[#b9ada0] hover:border-[#4f463e] hover:bg-[#26211d]"} block rounded-[8px] px-3 py-2 text-sm transition-colors`}
        >
          {entry.title}
        </IntentLink>
      ))}
    </nav>
  );
}
