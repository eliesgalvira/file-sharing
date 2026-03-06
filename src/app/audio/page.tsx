import { UploadExperience } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function AudioPage() {
  return <UploadExperience kind={getUploadKind("audio")} />;
}
