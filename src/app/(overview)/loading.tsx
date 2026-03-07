export default function Loading() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] px-5 py-4 sm:px-6">
        <div className="h-5 w-full max-w-[420px] animate-pulse rounded-[8px] bg-[#26211d]" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-5">
            <div className="h-6 w-24 animate-pulse rounded-[8px] bg-[#26211d]" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-[8px] bg-[#26211d]" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-[8px] bg-[#26211d]" />
            <div className="mt-6 h-4 w-28 animate-pulse rounded-[8px] bg-[#26211d]" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded-[8px] bg-[#26211d]" />
          </div>
        ))}
      </section>
    </div>
  );
}
