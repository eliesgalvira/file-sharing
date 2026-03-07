import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function TextPage() {
  return <UploadPageContent kind={getUploadKind("text")} />;
}
