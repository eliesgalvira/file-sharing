import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/modules/uploads";

export default function TextPage() {
  return <UploadPageContent kind={getUploadKind("text")} />;
}
