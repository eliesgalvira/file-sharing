import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function VideoPage() {
  return <UploadPageContent kind={getUploadKind("video")} />;
}
