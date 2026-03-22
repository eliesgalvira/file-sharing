import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/modules/uploads";

export default function BlobPage() {
  return <UploadPageContent kind={getUploadKind("blob")} />;
}
