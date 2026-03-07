import { IntentLink } from "~/components/intent-link";
import { uploadKinds } from "~/lib/site-data";

export function OverviewContent() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] px-5 py-4 sm:px-6">
        <p className="text-sm leading-6 text-[#b9ada0]">
          Pick a route to open its upload flow. Each route accepts a different file type and size limit.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {uploadKinds.map((entry) => (
          <IntentLink
            key={entry.slug}
            href={`/${entry.slug}`}
            align="start"
            className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-5 text-left transition-colors hover:border-[#5a5047] hover:bg-[#26211d]"
          >
            <span className="block">
              <span className="block text-base font-semibold text-[#f7efe5]">{entry.title}</span>
              <span className="mt-2 block text-sm text-[#b9ada0]">{entry.description}</span>
              <span className="mt-5 grid gap-2 text-sm text-[#f3efe8]">
                <span className="block">Limit: {entry.limit}</span>
                <span className="block text-[#8f8478]">Route: /{entry.slug}</span>
              </span>
            </span>
          </IntentLink>
        ))}
      </section>
    </div>
  );
}
