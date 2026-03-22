import { Effect, Match, Schema } from "effect";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { uploadKinds, type UploadKind } from "./catalog";

class UploadAuthorizationError extends Schema.TaggedErrorClass("UploadAuthorizationError")(
  "UploadAuthorizationError",
  {
    route: Schema.String,
    details: Schema.String,
  },
) {}

class UploadCompletionError extends Schema.TaggedErrorClass("UploadCompletionError")(
  "UploadCompletionError",
  {
    route: Schema.String,
    fileKey: Schema.String,
    details: Schema.String,
    error: Schema.Defect,
  },
) {}

export type UploadRouteErrorData = {
  readonly code: string;
  readonly reason: "authorization" | "completion" | "internal";
  readonly route: string | null;
  readonly fileKey: string | null;
  readonly details: string | null;
  readonly causeTag: string | null;
};

const isUploadRouteErrorData = (value: unknown): value is UploadRouteErrorData =>
  !!value &&
  typeof value === "object" &&
  "code" in value &&
  "reason" in value;

const formatUploadErrorData = (error: UploadThingError): UploadRouteErrorData => {
  const cause = error.cause;
  const data = isUploadRouteErrorData(error.data) ? error.data : undefined;

  return {
    code: error.code,
    reason: data?.reason ?? "internal",
    route: data?.route ?? null,
    fileKey: data?.fileKey ?? null,
    details: data?.details ?? null,
    causeTag:
      cause && typeof cause === "object" && "_tag" in cause && typeof cause._tag === "string"
        ? cause._tag
        : null,
  };
};

const uploadthing = createUploadthing({
  errorFormatter: formatUploadErrorData,
});

const toUploadThingError = (error: unknown): UploadThingError<UploadRouteErrorData> => {
  if (error instanceof UploadThingError) {
    return error as UploadThingError<UploadRouteErrorData>;
  }

  return Match.value(error).pipe(
    Match.when(
      (cause: unknown): cause is UploadAuthorizationError => cause instanceof UploadAuthorizationError,
      (cause) =>
        new UploadThingError<UploadRouteErrorData>({
          code: "FORBIDDEN",
          message: "You must be signed in to upload files.",
          cause,
          data: {
            code: "FORBIDDEN",
            reason: "authorization",
            route: cause.route,
            fileKey: null,
            details: cause.details,
            causeTag: cause._tag,
          },
        }),
    ),
    Match.when(
      (cause: unknown): cause is UploadCompletionError => cause instanceof UploadCompletionError,
      (cause) =>
        new UploadThingError<UploadRouteErrorData>({
          code: "UPLOAD_FAILED",
          message: "The upload finished, but the server could not finalize it.",
          cause,
          data: {
            code: "UPLOAD_FAILED",
            reason: "completion",
            route: cause.route,
            fileKey: cause.fileKey,
            details: cause.details,
            causeTag: cause._tag,
          },
        }),
    ),
    Match.orElse(
      (cause: unknown) =>
        new UploadThingError<UploadRouteErrorData>({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected upload error occurred.",
          cause,
          data: {
            code: "INTERNAL_SERVER_ERROR",
            reason: "internal",
            route: null,
            fileKey: null,
            details: null,
            causeTag:
              cause && typeof cause === "object" && "_tag" in cause && typeof cause._tag === "string"
                ? cause._tag
                : null,
          },
        }),
    ),
  );
};

const authenticate = Effect.fn("UploadRouter.authenticate")(function* (kind: UploadKind) {
  const user = { id: "fakeId" } as const;

  if (!user.id) {
    return yield* new UploadAuthorizationError({
      route: kind.slug,
      details: "The upload route could not resolve a user identity.",
    });
  }

  return user;
});

const logUploadCompletion = Effect.fn("UploadRouter.logUploadCompletion")(function* (
  kind: UploadKind,
  userId: string,
  fileKey: string,
  fileUrl: string,
) {
  if (!fileUrl) {
    return yield* new UploadCompletionError({
      route: kind.slug,
      fileKey,
      details: "UploadThing did not return a public file URL.",
      error: "Missing file URL",
    });
  }

  yield* Effect.logInfo(`Upload complete for userId: ${userId}`);
  yield* Effect.logInfo(`file url ${fileUrl}`);

  return { uploadedBy: userId };
});

const logUploadFailure = Effect.fn("UploadRouter.logUploadFailure")(function* (
  kind: UploadKind,
  fileKey: string,
  error: UploadThingError,
) {
  yield* Effect.logError("Upload route failed", {
    route: kind.slug,
    fileKey,
    code: error.code,
    message: error.message,
    data: formatUploadErrorData(error),
  });
});

const createProtectedRoute = (kind: UploadKind) =>
  uploadthing({
    [kind.fileType]: {
      maxFileSize: kind.maxFileSize,
      maxFileCount: kind.maxFileCount,
    },
  } as never)
    .middleware(async () => {
      const user = await Effect.runPromise(authenticate(kind).pipe(Effect.mapError(toUploadThingError)));

      return { userId: user.id };
    })
    .onUploadError(async ({ error, fileKey }) => {
      await Effect.runPromise(logUploadFailure(kind, fileKey, error));
    })
    .onUploadComplete(async ({ metadata, file }) =>
      Effect.runPromise(
        logUploadCompletion(kind, metadata.userId, file.key, file.ufsUrl).pipe(
          Effect.mapError(toUploadThingError),
        ),
      ),
    );

const [imageKind, videoKind, audioKind, pdfKind, textKind, blobKind] = uploadKinds;

export const ourFileRouter = {
  imageUploader: createProtectedRoute(imageKind),
  videoUploader: createProtectedRoute(videoKind),
  audioUploader: createProtectedRoute(audioKind),
  pdfUploader: createProtectedRoute(pdfKind),
  textUploader: createProtectedRoute(textKind),
  blobUploader: createProtectedRoute(blobKind),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
