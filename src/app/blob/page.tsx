import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function BlobPage() {
  return <UploadPageContent kind={getUploadKind("blob")} />;
}
