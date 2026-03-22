import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/modules/uploads";

export default function ImagePage() {
  return <UploadPageContent kind={getUploadKind("image")} />;
}
