"use client";

import { usePathname } from "next/navigation";
import { ShellSidebarNav } from "~/components/shell-navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOverviewRoute = pathname === "/";

  return (
    <div className="min-h-screen bg-[#171717] text-[#f3efe8]">
      <header className="border-b border-[#36312c] bg-[#1f1c19]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-[#f7efe5]">File sharing</h1>
            <p className="mt-1 max-w-xl text-sm text-[#b9ada0]">Simple public uploads, organized by file type.</p>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto min-h-[calc(100vh-73px)] max-w-6xl gap-6 px-4 py-6 sm:px-6 ${
          isOverviewRoute ? "grid" : "grid lg:grid-cols-[260px_minmax(0,1fr)]"
        }`}
      >
        {isOverviewRoute ? null : (
          <aside className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-3">
            <ShellSidebarNav />
          </aside>
        )}

        <section className="min-w-0">{children}</section>
      </main>
    </div>
  );
}
