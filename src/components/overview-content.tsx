import Link from "next/link";
import { uploadKinds } from "~/lib/site-data";

export function OverviewContent() {
  return (
    <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-5 sm:p-6">
      <h2 className="text-2xl font-semibold text-[#f7efe5]">Choose an upload type</h2>
      <div className="mt-6 overflow-hidden rounded-[10px] border border-[#36312c]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#221f1b] text-[#b9ada0]">
              <tr>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Accepted content</th>
                <th className="px-4 py-3 font-medium">Limit</th>
              </tr>
            </thead>
            <tbody>
              {uploadKinds.map((entry) => (
                <tr key={entry.slug} className="border-t border-[#36312c] align-top">
                  <td className="px-4 py-3">
                    <Link href={`/${entry.slug}`} prefetch={true} className="underline underline-offset-2">
                      {entry.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#b9ada0]">{entry.description}</td>
                  <td className="px-4 py-3 text-[#b9ada0]">{entry.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
