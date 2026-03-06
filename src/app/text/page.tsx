import { UploadExperience } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function TextPage() {
  return <UploadExperience kind={getUploadKind("text")} />;
}
