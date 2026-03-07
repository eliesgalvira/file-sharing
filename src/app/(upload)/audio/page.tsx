import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function AudioPage() {
  return <UploadPageContent kind={getUploadKind("audio")} />;
}
