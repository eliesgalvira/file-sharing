export const uploadKinds = [
  {
    slug: "image",
    title: "Image",
    description: "PNG, JPG, GIF, WEBP",
    limit: "Up to 8 MB",
    endpoint: "imageUploader",
    accept: "Images",
    acceptAttr: "image/png,image/jpeg,image/gif,image/webp",
  },
  {
    slug: "video",
    title: "Video",
    description: "MP4, MOV, WEBM",
    limit: "Up to 64 MB",
    endpoint: "videoUploader",
    accept: "Videos",
    acceptAttr: "video/mp4,video/quicktime,video/webm",
  },
  {
    slug: "audio",
    title: "Audio",
    description: "MP3, WAV, M4A",
    limit: "Up to 64 MB",
    endpoint: "audioUploader",
    accept: "Audio files",
    acceptAttr: "audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/m4a",
  },
  {
    slug: "pdf",
    title: "PDF",
    description: "Single document upload",
    limit: "Up to 16 MB",
    endpoint: "pdfUploader",
    accept: "PDF documents",
    acceptAttr: "application/pdf",
  },
  {
    slug: "text",
    title: "Text",
    description: "TXT, MD, CSV, JSON",
    limit: "Up to 64 KB",
    endpoint: "textUploader",
    accept: "Plain text files",
    acceptAttr: ".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json",
  },
  {
    slug: "blob",
    title: "Blob",
    description: "Generic binary data",
    limit: "Up to 8 MB",
    endpoint: "blobUploader",
    accept: "Binary blobs",
    acceptAttr: "",
  },
] as const;

export type UploadSlug = (typeof uploadKinds)[number]["slug"];
export type UploadKind = (typeof uploadKinds)[number];

export function getUploadKind(slug?: string | null) {
  const kind = uploadKinds.find((entry) => entry.slug === slug);
  if (!kind) {
    throw new Error(`Unknown upload kind: ${slug}`);
  }
  return kind;
}
