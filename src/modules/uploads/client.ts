import { generateReactHelpers } from "@uploadthing/react";
import { Effect, Match, Schema } from "effect";
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

const splitAcceptRules = (acceptAttr: string) =>
  acceptAttr
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

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

  return Match.value(error.data?.reason).pipe(
    Match.when(
      "authorization",
      () => details ?? "You must be signed in before uploading files.",
    ),
    Match.when(
      "completion",
      () => details ?? "The file uploaded, but the server could not finish processing it.",
    ),
    Match.when(
      "internal",
      () => details ?? "An unexpected upload error occurred.",
    ),
    Match.orElse(() => error.message),
  );
}

export const { useUploadThing, getRouteConfig } = generateReactHelpers<OurFileRouter>();
