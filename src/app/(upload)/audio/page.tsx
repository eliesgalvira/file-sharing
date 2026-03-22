import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/modules/uploads";

export default function AudioPage() {
  return <UploadPageContent kind={getUploadKind("audio")} />;
}
