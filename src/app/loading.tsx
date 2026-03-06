export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] text-[#f3efe8]">
      <header className="border-b border-[#36312c] bg-[#1f1c19]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-[#f7efe5]">File sharing</h1>
            <p className="mt-1 text-sm text-[#b9ada0]">Loading route</p>
          </div>
          <div className="h-9 w-24 rounded-[8px] border border-[#4f463e] bg-[#26211d]" />
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-3">
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-[8px] border border-[#2d2824] bg-[#26211d]"
              />
            ))}
          </div>
        </aside>

        <section className="grid gap-6">
          <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-8 w-48 animate-pulse rounded-[8px] bg-[#26211d]" />
                <div className="h-5 w-72 animate-pulse rounded-[8px] bg-[#26211d]" />
              </div>
              <div className="h-10 w-28 animate-pulse rounded-[8px] border border-[#4a433d] bg-[#25211d]" />
            </div>

            <div className="mt-6 rounded-[10px] border border-dashed border-[#6f5a45] bg-[#1b1815] px-8 py-10">
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <div className="h-14 w-14 animate-pulse rounded-[10px] border border-[#5a5047] bg-[#221d19]" />
                <div className="mt-6 h-8 w-56 animate-pulse rounded-[8px] bg-[#26211d]" />
                <div className="mt-3 h-5 w-80 animate-pulse rounded-[8px] bg-[#26211d]" />
                <div className="mt-6 h-11 w-40 animate-pulse rounded-[8px] bg-[#d08b52]" />
                <div className="mt-6 h-5 w-60 animate-pulse rounded-[8px] bg-[#26211d]" />
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[300px_300px_1fr]">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[10px] border border-[#4a433d] bg-[#25211d] p-5">
                <div className="h-5 w-28 animate-pulse rounded-[8px] bg-[#2e2823]" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-full animate-pulse rounded-[8px] bg-[#2e2823]" />
                  <div className="h-4 w-4/5 animate-pulse rounded-[8px] bg-[#2e2823]" />
                  <div className="h-4 w-3/5 animate-pulse rounded-[8px] bg-[#2e2823]" />
                </div>
              </div>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
