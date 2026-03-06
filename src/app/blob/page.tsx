import { UploadExperience } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function BlobPage() {
  return <UploadExperience kind={getUploadKind("blob")} />;
}
