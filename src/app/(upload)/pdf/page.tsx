import { UploadPageContent } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function PdfPage() {
  return <UploadPageContent kind={getUploadKind("pdf")} />;
}
