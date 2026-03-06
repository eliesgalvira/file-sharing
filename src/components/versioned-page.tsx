import { notFound } from "next/navigation";
import { UploadExperience } from "~/components/upload-experience";
import { getUploadKind, isDesignId, type DesignId } from "~/lib/site-data";

type VersionedPageProps = {
  design: DesignId;
  slug?: string;
  basePath?: string;
};

export function VersionedPage({ design, slug, basePath = "" }: VersionedPageProps) {
  if (!isDesignId(design)) {
    notFound();
  }

  const kind = slug ? getUploadKind(slug) : undefined;

  if (slug && !kind) {
    notFound();
  }

  return <UploadExperience design={design} kind={kind} basePath={basePath} />;
}
