import { UploadExperience } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function ImagePage() {
  return <UploadExperience kind={getUploadKind("image")} />;
}
