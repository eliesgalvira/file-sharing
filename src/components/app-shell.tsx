"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { uploadKinds } from "~/lib/site-data";

function PendingSpinner() {
  const { pending } = useLinkStatus();

  return (
    <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden="true">
      <span
        className={`h-3 w-3 rounded-full border border-[#d08b52]/40 border-t-[#d08b52] transition-opacity ${pending ? "opacity-100 animate-spin" : "opacity-0"}`}
      />
    </span>
  );
}

function ShellLink({
  href,
  active,
  children,
  className,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className: string;
}) {
  if (active) {
    return (
      <span aria-current="page" className={`${className} flex items-center justify-between gap-3`}>
        <span>{children}</span>
        <span className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }

  return (
    <Link href={href} prefetch={true} className={`${className} flex items-center justify-between gap-3`}>
      <span>{children}</span>
      <PendingSpinner />
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeSlug = pathname === "/" ? null : pathname.slice(1);

  return (
    <div className="min-h-screen bg-[#171717] text-[#f3efe8]">
      <header className="border-b border-[#36312c] bg-[#1f1c19]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-[#f7efe5]">File sharing</h1>
            <p className="mt-1 max-w-xl text-sm text-[#b9ada0]">Simple public uploads, organized by file type.</p>
          </div>
          <ShellLink
            href="/"
            active={pathname === "/"}
            className="rounded-[8px] border border-[#4f463e] px-3 py-2 text-sm text-[#f3efe8] transition-colors hover:bg-[#26211d]"
          >
            Overview
          </ShellLink>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-3">
          <nav className="space-y-1">
            <ShellLink
              href="/"
              active={pathname === "/"}
              className={`${pathname === "/" ? "border border-[#b67445] bg-[#2b241e] text-[#f7efe5]" : "border border-transparent text-[#b9ada0] hover:border-[#4f463e] hover:bg-[#26211d]"} block rounded-[8px] px-3 py-2 text-sm transition-colors`}
            >
              All upload types
            </ShellLink>
            {uploadKinds.map((entry) => (
              <ShellLink
                key={entry.slug}
                href={`/${entry.slug}`}
                active={activeSlug === entry.slug}
                className={`${activeSlug === entry.slug ? "border border-[#b67445] bg-[#2b241e] text-[#f7efe5]" : "border border-transparent text-[#b9ada0] hover:border-[#4f463e] hover:bg-[#26211d]"} block rounded-[8px] px-3 py-2 text-sm transition-colors`}
              >
                {entry.title}
              </ShellLink>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </main>
    </div>
  );
}
