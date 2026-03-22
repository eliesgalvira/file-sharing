import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/modules/uploads";

export default function VideoPage() {
  return <UploadPageContent kind={getUploadKind("video")} />;
}
