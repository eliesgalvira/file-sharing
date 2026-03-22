import { describe, expect, test } from "bun:test";
import { Effect } from "effect";
import {
  UnsupportedFileTypeError,
  formatFileSize,
  getUploadKind,
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
});
