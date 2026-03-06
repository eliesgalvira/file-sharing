import { UploadExperience } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function PdfPage() {
  return <UploadExperience kind={getUploadKind("pdf")} />;
}
