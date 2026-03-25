import { describe, expect, test } from "bun:test";
import { Effect } from "effect-beta";
import {
  FileTooLargeError,
  UnsupportedFileTypeError,
  formatFileSize,
  getUploadErrorMessage,
  getUploadKind,
  normalizeFileForUpload,
  uploadKinds,
  validateSelectedFile,
} from "./index";

describe("uploads module", () => {
  test("exposes the configured upload kinds", () => {
    expect(uploadKinds).toHaveLength(6);
    expect(getUploadKind("image").endpoint).toBe("imageUploader");
  });

  test("formats file sizes for display", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  test("validates accepted files", async () => {
    const file = new File(["hello"], "note.md", { type: "text/markdown" });
    const pendingFile = await Effect.runPromise(validateSelectedFile(file, getUploadKind("text")));

    expect(pendingFile.name).toBe("note.md");
    expect(pendingFile.size).toBe(file.size);
  });

  test("rejects unsupported files with a typed error", async () => {
    const file = new File(["data"], "movie.mp4", { type: "video/mp4" });

    await expect(
      Effect.runPromise(validateSelectedFile(file, getUploadKind("image"))),
    ).rejects.toBeInstanceOf(UnsupportedFileTypeError);
  });

  test("rejects files that exceed the configured route size", async () => {
    const file = new File([new Uint8Array(70 * 1024 * 1024)], "capture.pcapng", {
      type: "application/octet-stream",
    });

    await expect(
      Effect.runPromise(validateSelectedFile(file, getUploadKind("blob"))),
    ).rejects.toBeInstanceOf(FileTooLargeError);
  });

  test("normalizes blob uploads to application/octet-stream", () => {
    const file = new File(["pcap"], "capture.pcapng", {
      type: "application/x-pcapng",
      lastModified: 123,
    });

    const normalized = normalizeFileForUpload(file, getUploadKind("blob"));

    expect(normalized).not.toBe(file);
    expect(normalized.name).toBe("capture.pcapng");
    expect(normalized.type).toBe("application/octet-stream");
    expect(normalized.lastModified).toBe(123);
  });
  test("formats structured uploadthing authorization errors for the UI", () => {
    expect(
      getUploadErrorMessage({
        message: "Failed to run middleware",
        data: {
          code: "FORBIDDEN",
          message: "You must be signed in to upload files.",
          reason: "authorization",
          route: "image",
          fileKey: null,
          details: "The upload route could not resolve a user identity.",
          causeTag: "UploadAuthorizationError",
          causeMessage: "UploadAuthorizationError",
        },
      }),
    ).toBe("The upload route could not resolve a user identity.");
  });

  test("formats generic uploadthing size errors for the UI", () => {
    expect(
      getUploadErrorMessage({
        message: "FileSizeMismatch: file size is too large",
        data: undefined,
      }),
    ).toBe("The selected file exceeds this route's size limit.");
  });

  test("formats opaque uploadthing provider errors with structured fallback details", () => {
    expect(
      getUploadErrorMessage({
        message: "UPLOAD_FAILED",
        data: {
          code: "UPLOAD_FAILED",
          message: "UploadThing could not store this file.",
          reason: "internal",
          route: "blob",
          fileKey: null,
          details: "File upload rejected by the upstream provider.",
          causeTag: null,
          causeMessage: "Possible malware or unsupported binary signature.",
        },
      }),
    ).toBe("File upload rejected by the upstream provider.");
  });
});
