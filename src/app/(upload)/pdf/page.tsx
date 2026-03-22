import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/modules/uploads";

export default function PdfPage() {
  return <UploadPageContent kind={getUploadKind("pdf")} />;
}
