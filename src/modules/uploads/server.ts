import { Effect } from "effect";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { uploadKinds, type UploadKind } from "./catalog";

const uploadthing = createUploadthing();

const authenticate = Effect.succeed({ id: "fakeId" } as const).pipe(
  Effect.withSpan("UploadRouter.authenticate"),
);

const logUploadCompletion = Effect.fn("UploadRouter.logUploadCompletion")(function* (
  userId: string,
  fileUrl: string,
) {
  yield* Effect.logInfo(`Upload complete for userId: ${userId}`);
  yield* Effect.logInfo(`file url ${fileUrl}`);

  return { uploadedBy: userId };
});

const createProtectedRoute = (kind: UploadKind) =>
  uploadthing({
    [kind.fileType]: {
      maxFileSize: kind.maxFileSize,
      maxFileCount: kind.maxFileCount,
    },
  } as never)
    .middleware(async () => {
      const user = await Effect.runPromise(authenticate);

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) =>
      Effect.runPromise(logUploadCompletion(metadata.userId, file.ufsUrl)),
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
