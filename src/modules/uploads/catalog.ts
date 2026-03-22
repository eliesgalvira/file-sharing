import { Effect, Schema as S } from "effect";

export const UploadSlug = S.Literals(["image", "video", "audio", "pdf", "text", "blob"]);
export type UploadSlug = typeof UploadSlug.Type;

export const UploadEndpoint = S.Literals([
  "imageUploader",
  "videoUploader",
  "audioUploader",
  "pdfUploader",
  "textUploader",
  "blobUploader",
]);
export type UploadEndpoint = typeof UploadEndpoint.Type;

export const UploadFileType = S.Literals(["image", "video", "audio", "pdf", "text", "blob"]);
export type UploadFileType = typeof UploadFileType.Type;

export const UploadKindSchema = S.Struct({
  slug: UploadSlug,
  title: S.String,
  description: S.String,
  limit: S.String,
  endpoint: UploadEndpoint,
  accept: S.String,
  acceptAttr: S.String,
  fileType: UploadFileType,
  maxFileSize: S.String,
  maxFileCount: S.Number,
});
export type UploadKind = typeof UploadKindSchema.Type;

export class UnknownUploadKindError extends S.TaggedErrorClass("UnknownUploadKindError")(
  "UnknownUploadKindError",
  {
    slug: S.String,
  },
) {}

export const uploadKinds = [
  {
    slug: "image",
    title: "Image",
    description: "PNG, JPG, GIF, WEBP",
    limit: "Up to 8 MB",
    endpoint: "imageUploader",
    accept: "Images",
    acceptAttr: "image/png,image/jpeg,image/gif,image/webp",
    fileType: "image",
    maxFileSize: "8MB",
    maxFileCount: 30,
  },
  {
    slug: "video",
    title: "Video",
    description: "MP4, MOV, WEBM",
    limit: "Up to 64 MB",
    endpoint: "videoUploader",
    accept: "Videos",
    acceptAttr: "video/mp4,video/quicktime,video/webm",
    fileType: "video",
    maxFileSize: "64MB",
    maxFileCount: 3,
  },
  {
    slug: "audio",
    title: "Audio",
    description: "MP3, WAV, M4A",
    limit: "Up to 64 MB",
    endpoint: "audioUploader",
    accept: "Audio files",
    acceptAttr: "audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/m4a",
    fileType: "audio",
    maxFileSize: "64MB",
    maxFileCount: 1,
  },
  {
    slug: "pdf",
    title: "PDF",
    description: "Single document upload",
    limit: "Up to 16 MB",
    endpoint: "pdfUploader",
    accept: "PDF documents",
    acceptAttr: "application/pdf",
    fileType: "pdf",
    maxFileSize: "16MB",
    maxFileCount: 1,
  },
  {
    slug: "text",
    title: "Text",
    description: "TXT, MD, CSV, JSON",
    limit: "Up to 64 KB",
    endpoint: "textUploader",
    accept: "Plain text files",
    acceptAttr: ".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json",
    fileType: "text",
    maxFileSize: "64KB",
    maxFileCount: 1,
  },
  {
    slug: "blob",
    title: "Blob",
    description: "Generic binary data",
    limit: "Up to 8 MB",
    endpoint: "blobUploader",
    accept: "Binary blobs",
    acceptAttr: "",
    fileType: "blob",
    maxFileSize: "8MB",
    maxFileCount: 1,
  },
] as const satisfies readonly UploadKind[];

const uploadKindsBySlug = new Map<UploadSlug, UploadKind>(uploadKinds.map((kind) => [kind.slug, kind]));

export const getUploadKindEffect: (
  slug?: string | null,
) => Effect.Effect<UploadKind, UnknownUploadKindError> = Effect.fn("UploadCatalog.getUploadKind")(function* (
  slug?: string | null,
) {
  const kind = slug ? uploadKindsBySlug.get(slug as UploadSlug) : undefined;

  if (kind) {
    return kind;
  }

  return yield* new UnknownUploadKindError({ slug: slug ?? "(missing)" });
});

export function getUploadKind(slug?: string | null): UploadKind {
  return Effect.runSync(getUploadKindEffect(slug));
}
