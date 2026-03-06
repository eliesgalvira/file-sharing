import { UploadExperience } from "~/components/upload-experience";
import { getUploadKind } from "~/lib/site-data";

export default function VideoPage() {
  return <UploadExperience kind={getUploadKind("video")} />;
}
