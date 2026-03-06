export const uploadKinds = [
  {
    slug: "image",
    title: "Image",
    description: "PNG, JPG, GIF, WEBP",
    limit: "Up to 8 MB",
    endpoint: "imageUploader",
    accept: "Images",
  },
  {
    slug: "video",
    title: "Video",
    description: "MP4, MOV, WEBM",
    limit: "Up to 64 MB",
    endpoint: "videoUploader",
    accept: "Videos",
  },
  {
    slug: "audio",
    title: "Audio",
    description: "MP3, WAV, M4A",
    limit: "Up to 64 MB",
    endpoint: "audioUploader",
    accept: "Audio files",
  },
  {
    slug: "pdf",
    title: "PDF",
    description: "Single document upload",
    limit: "Up to 16 MB",
    endpoint: "pdfUploader",
    accept: "PDF documents",
  },
  {
    slug: "text",
    title: "Text",
    description: "TXT, MD, CSV, JSON",
    limit: "Up to 64 KB",
    endpoint: "textUploader",
    accept: "Plain text files",
  },
  {
    slug: "blob",
    title: "Blob",
    description: "Generic binary data",
    limit: "Up to 8 MB",
    endpoint: "blobUploader",
    accept: "Binary blobs",
  },
] as const;

export type UploadSlug = (typeof uploadKinds)[number]["slug"];
export type UploadKind = (typeof uploadKinds)[number];
export type UploadEndpoint = (typeof uploadKinds)[number]["endpoint"];

export const designIds = ["1", "2", "3"] as const;
export type DesignId = (typeof designIds)[number];

export function getUploadKind(slug?: string | null) {
  return uploadKinds.find((kind) => kind.slug === slug);
}

export function isDesignId(value?: string | null): value is DesignId {
  return designIds.includes(value as DesignId);
}
