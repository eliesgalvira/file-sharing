import { generateReactHelpers } from "@uploadthing/react";
import { Effect, Match, Schema } from "effect-beta";
import type { UploadKind } from "./catalog";
import { UploadSlug } from "./catalog";
import type { OurFileRouter } from "./server";
import type { UploadRouteErrorData } from "./server";

export class PendingUploadFile extends Schema.Class("PendingUploadFile")({
  name: Schema.String,
  size: Schema.Number,
}) {}

export class UnsupportedFileTypeError extends Schema.TaggedErrorClass("UnsupportedFileTypeError")(
  "UnsupportedFileTypeError",
  {
    slug: UploadSlug,
    accept: Schema.String,
    fileName: Schema.String,
    mimeType: Schema.String,
  },
) {}

export class FileTooLargeError extends Schema.TaggedErrorClass("FileTooLargeError")(
  "FileTooLargeError",
  {
    slug: UploadSlug,
    fileName: Schema.String,
    fileSize: Schema.Number,
    maxFileSize: Schema.String,
  },
) {}

export const normalizeFileForUpload = (file: File, kind: UploadKind) => {
  if (kind.fileType !== "blob" || file.type === "application/octet-stream") {
    return file;
  }

  return new File([file], file.name, {
    type: "application/octet-stream",
    lastModified: file.lastModified,
  });
};
const splitAcceptRules = (acceptAttr: string) =>
  acceptAttr
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const fileSizeUnitToBytes = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

const parseFileSizeToBytes = (value: string) => {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);

  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  const [, amount, unit] = match;
  return Number(amount) * fileSizeUnitToBytes[unit.toUpperCase() as keyof typeof fileSizeUnitToBytes];
};

const matchesRule = (file: File, rule: string) =>
  Match.value(rule).pipe(
    Match.when(
      (value) => value.startsWith("."),
      (extension) => file.name.toLowerCase().endsWith(extension.toLowerCase()),
    ),
    Match.when(
      (value) => value.endsWith("/*"),
      (prefix) => file.type.startsWith(prefix.slice(0, -1)),
    ),
    Match.orElse((mimeType) => file.type === mimeType),
  );

export const validateSelectedFile = Effect.fn("UploadClient.validateSelectedFile")(function* (
  file: File,
  kind: UploadKind,
) {
  const acceptedRules = splitAcceptRules(kind.acceptAttr);
  const isAccepted =
    acceptedRules.length === 0 || acceptedRules.some((rule) => matchesRule(file, rule));

  if (!isAccepted) {
    return yield* new UnsupportedFileTypeError({
      slug: kind.slug,
      accept: kind.accept,
      fileName: file.name,
      mimeType: file.type,
    });
  }

  const maxFileSizeInBytes = parseFileSizeToBytes(kind.maxFileSize);

  if (file.size > maxFileSizeInBytes) {
    return yield* new FileTooLargeError({
      slug: kind.slug,
      fileName: file.name,
      fileSize: file.size,
      maxFileSize: kind.maxFileSize,
    });
  }

  return new PendingUploadFile({
    name: file.name,
    size: file.size,
  });
});

export function formatFileSize(bytes: number) {
  return Match.value(bytes).pipe(
    Match.when((value) => value < 1024, (value) => `${value} B`),
    Match.orElse((value) => {
      const units = ["KB", "MB", "GB"] as const;
      let size = value / 1024;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
      }

      return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
    }),
  );
}

export function getUploadErrorMessage(error: {
  readonly message: string;
  readonly data: UploadRouteErrorData | undefined;
}) {
  const details = error.data?.details?.trim();
  const formattedMessage = error.data?.message?.trim();
  const causeMessage = error.data?.causeMessage?.trim();
  const normalizedMessage = error.message.toLowerCase();

  return Match.value(error.data?.reason).pipe(
    Match.when(
      "authorization",
      () => details ?? formattedMessage ?? "You must be signed in before uploading files.",
    ),
    Match.when(
      "completion",
      () =>
        details ?? causeMessage ?? formattedMessage ?? "The file uploaded, but the server could not finish processing it.",
    ),
    Match.when(
      "internal",
      () => details ?? causeMessage ?? formattedMessage ?? "An unexpected upload error occurred.",
    ),
    Match.orElse(() =>
      Match.value(true).pipe(
        Match.when(
          () =>
            normalizedMessage.includes("filesizemismatch") ||
            normalizedMessage.includes("file size") ||
            normalizedMessage.includes("too large"),
          () => "The selected file exceeds this route's size limit.",
        ),
        Match.when(
          () =>
            normalizedMessage.includes("invalidfiletype") ||
            normalizedMessage.includes("not allowed"),
          () => "This file type is not allowed on this route.",
        ),
        Match.when(
          () => error.message === error.message.toUpperCase() && error.message.includes("_"),
          () => formattedMessage ?? causeMessage ?? "The upload provider rejected this file.",
        ),
        Match.orElse(() => error.message),
      ),
    ),
  );
}

export const { useUploadThing, getRouteConfig } = generateReactHelpers<OurFileRouter>();
