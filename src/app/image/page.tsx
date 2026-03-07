import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function ImagePage() {
  return <UploadPageContent kind={getUploadKind("image")} />;
}
