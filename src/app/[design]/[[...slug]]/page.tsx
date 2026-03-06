import { notFound } from "next/navigation";
import { VersionedPage } from "~/components/versioned-page";
import { designIds, isDesignId } from "~/lib/site-data";

export function generateStaticParams() {
  return designIds.map((design) => ({ design }));
}

export default async function DesignPage({
  params,
}: {
  params: Promise<{ design: string; slug?: string[] }>;
}) {
  const { design, slug } = await params;

  if (!isDesignId(design) || (slug && slug.length > 1)) {
    notFound();
  }

  return <VersionedPage design={design} slug={slug?.[0]} basePath={`/${design}`} />;
}
