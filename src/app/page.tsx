import Link from "next/link";

const versions = [
  {
    id: "1",
    name: "Library",
    note: "Warm light layout with a fixed navigation rail and a document-like upload panel.",
  },
  {
    id: "2",
    name: "Control",
    note: "Dark workspace with a top toolbar, route table, and straightforward upload views.",
  },
  {
    id: "3",
    name: "Field",
    note: "Quiet green-gray dashboard with a compact rail and route-focused detail panels.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f2f1ec] px-5 py-8 text-[#1f2420] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-[#cfd5cc] pb-6">
          <h1 className="text-3xl font-semibold">Three redesigns</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#5c655e]">
            Each version keeps the same upload routes and backend behavior. Compare them at `/1`, `/2`, and `/3`, including nested routes such as `/1/video` and `/3/audio`.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {versions.map((version) => (
            <article key={version.id} className="rounded-[10px] border border-[#cfd5cc] bg-[#ffffff] p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{version.name}</h2>
                <Link href={`/${version.id}`} className="rounded-[8px] bg-[#1f2420] px-3 py-2 text-sm text-[#f2f1ec] transition-colors hover:bg-[#334239]">
                  Open /{version.id}
                </Link>
              </div>
              <p className="mt-3 text-sm text-[#5c655e]">{version.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-[10px] border border-[#cfd5cc] bg-[#ffffff] p-5">
          <h2 className="text-lg font-semibold">Base routes</h2>
          <p className="mt-2 text-sm text-[#5c655e]">
            The unprefixed routes now use version 1 so the existing URLs remain usable while the three redesign variants live under their own route prefixes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {[
              "/image",
              "/video",
              "/audio",
              "/pdf",
              "/text",
              "/blob",
            ].map((route) => (
              <Link key={route} href={route} className="rounded-[8px] border border-[#cfd5cc] px-3 py-2 transition-colors hover:bg-[#f2f1ec]">
                {route}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
