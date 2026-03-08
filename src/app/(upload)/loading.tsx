export default function Loading() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-8 w-40 animate-pulse rounded-[8px] bg-[#26211d] sm:w-48" />
            <div className="h-5 w-52 max-w-full animate-pulse rounded-[8px] bg-[#26211d] sm:w-72" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 animate-pulse rounded-[8px] border border-[#4a433d] bg-[#25211d] sm:w-32" />
            <div className="h-10 w-24 animate-pulse rounded-[8px] border border-[#4a433d] bg-[#25211d] sm:w-28" />
          </div>
        </div>

        <div className="mt-6 rounded-[10px] border border-dashed border-[#6f5a45] bg-[#1b1815] px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
            <div className="h-14 w-14 animate-pulse rounded-[10px] border border-[#5a5047] bg-[#221d19]" />
            <div className="mt-6 h-8 w-44 max-w-full animate-pulse rounded-[8px] bg-[#26211d] sm:w-56" />
            <div className="mt-3 h-5 w-full max-w-[320px] animate-pulse rounded-[8px] bg-[#26211d]" />
            <div className="mt-6 h-11 w-40 animate-pulse rounded-[8px] bg-[#d08b52]" />
            <div className="mt-6 h-5 w-full max-w-[260px] animate-pulse rounded-[8px] bg-[#26211d]" />
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-5 sm:p-6">
        <div className="h-5 w-28 animate-pulse rounded-[8px] bg-[#26211d]" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[8px] border border-[#4a433d] bg-[#25211d] p-3">
              <div className="h-4 w-16 animate-pulse rounded-[8px] bg-[#2e2823]" />
              <div className="mt-2 h-5 w-28 animate-pulse rounded-[8px] bg-[#2e2823]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
