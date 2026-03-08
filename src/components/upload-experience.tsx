"use client";

import { useRef, useState } from "react";
import { type UploadKind } from "~/lib/site-data";
import { useUploadThing } from "~/utils/uploadthing";

type PendingFile = {
  name: string;
  size: number;
};

type UploadInfoCardsProps = {
  endpoint: string;
  accept: string;
  pendingFile: PendingFile | null;
  errorMessage: string | null;
  statusMessage: string;
  uploadProgress: number;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function isAcceptedFile(file: File, kind: UploadKind) {
  if (!kind.acceptAttr) {
    return true;
  }

  const accepted = kind.acceptAttr.split(",").map((value) => value.trim()).filter(Boolean);

  return accepted.some((rule) => {
    if (rule.startsWith(".")) {
      return file.name.toLowerCase().endsWith(rule.toLowerCase());
    }

    if (rule.endsWith("/*")) {
      return file.type.startsWith(rule.slice(0, -1));
    }

    return file.type === rule;
  });
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#5a5047] bg-[#221d19] px-4 text-sm font-medium text-[#f3efe8] transition-colors hover:border-[#7a6d61] hover:bg-[#2a241f]"
      aria-label="Copy share link"
      title={copied ? "Copied" : "Copy link"}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current">
        <path d="M6.5 2.75A1.75 1.75 0 0 0 4.75 4.5v8c0 .967.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 14.25 12.5v-8a1.75 1.75 0 0 0-1.75-1.75h-6Zm-.25 1.75c0-.138.112-.25.25-.25h6c.138 0 .25.112.25.25v8a.25.25 0 0 1-.25.25h-6a.25.25 0 0 1-.25-.25v-8Zm10 3.5v7.5A1.75 1.75 0 0 1 14.5 17.25H8a1.75 1.75 0 0 1-1.75-1.75v-.5h1.5v.5c0 .138.112.25.25.25h6.5c.138 0 .25-.112.25-.25V8h1.5Z" />
      </svg>
      <span>{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}

function ShareLinkCard({ uploadedUrl }: { uploadedUrl: string }) {
  return (
    <section className="mt-4 rounded-[10px] border border-[#4a433d] bg-[#25211d] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#f7efe5]">Share link</h3>
          <p className="mt-1 text-sm text-[#b9ada0]">
            Your file is ready. Copy the public URL or open it in a new tab.
          </p>
        </div>
        <CopyButton value={uploadedUrl} />
      </div>
      <div className="mt-4 rounded-[8px] border border-[#3d3630] bg-[#1e1a17] p-4 text-sm text-[#f3efe8]">
        <a href={uploadedUrl} target="_blank" rel="noreferrer" className="break-all underline underline-offset-2">
          {uploadedUrl}
        </a>
      </div>
    </section>
  );
}

function UploadInfoCards({
  endpoint,
  accept,
  pendingFile,
  errorMessage,
  statusMessage,
  uploadProgress,
}: UploadInfoCardsProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[10px] border border-[#4a433d] bg-[#25211d] p-5">
        <h3 className="text-base font-semibold text-[#f7efe5]">Current upload</h3>
        <dl className="mt-4 grid gap-4 text-sm">
          <div>
            <dt className="text-[#b9ada0]">File</dt>
            <dd className="mt-1 break-all text-[#f3efe8]">{pendingFile?.name ?? "No file selected"}</dd>
          </div>
          <div>
            <dt className="text-[#b9ada0]">Status</dt>
            <dd className="mt-1 text-[#f3efe8]">{errorMessage ?? statusMessage}</dd>
          </div>
          <div>
            <dt className="text-[#b9ada0]">Progress</dt>
            <dd className="mt-1 text-[#f3efe8]">{uploadProgress}%</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[10px] border border-[#4a433d] bg-[#25211d] p-5">
        <h3 className="text-base font-semibold text-[#f7efe5]">Route details</h3>
        <dl className="mt-4 grid gap-4 text-sm">
          <div>
            <dt className="text-[#b9ada0]">Accepted content</dt>
            <dd className="mt-1 text-[#f3efe8]">{accept}</dd>
          </div>
          <div>
            <dt className="text-[#b9ada0]">Endpoint</dt>
            <dd className="mt-1 font-mono text-xs text-[#f3efe8]">{endpoint}</dd>
          </div>
          <div>
            <dt className="text-[#b9ada0]">Upload mode</dt>
            <dd className="mt-1 text-[#f3efe8]">Automatic after selection or drop</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export function UploadPageContent({ kind }: { kind: UploadKind }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Waiting for a file");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { startUpload, isUploading } = useUploadThing(kind.endpoint, {
    uploadProgressGranularity: "fine",
    onUploadBegin: (fileName) => {
      setUploadedUrl(null);
      setErrorMessage(null);
      setStatusMessage(`Uploading ${fileName}`);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
      setStatusMessage(`Uploading ${progress}%`);
    },
    onClientUploadComplete: (response) => {
      setUploadProgress(100);
      setStatusMessage("Upload complete");
      setUploadedUrl(response[0]?.ufsUrl ?? null);
    },
    onUploadError: (error) => {
      setUploadProgress(0);
      setStatusMessage("Upload failed");
      setErrorMessage(error.message);
    },
  });

  async function queueFile(file: File | null) {
    if (!file || isUploading) return;

    if (!isAcceptedFile(file, kind)) {
      setPendingFile(null);
      setUploadedUrl(null);
      setUploadProgress(0);
      setStatusMessage("Unsupported file type");
      setErrorMessage(`This route only accepts ${kind.accept.toLowerCase()}.`);
      return;
    }

    setPendingFile({ name: file.name, size: file.size });
    setUploadedUrl(null);
    setErrorMessage(null);
    setStatusMessage("Preparing upload");
    setUploadProgress(0);
    await startUpload([file]);
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#f7efe5]">{kind.title} upload</h2>
            <p className="mt-2 text-sm text-[#b9ada0]">{kind.description}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsInfoOpen((current) => !current)}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#4a433d] bg-[#25211d] px-3 text-sm text-[#f3efe8] transition-colors hover:border-[#6a6057] hover:bg-[#2b2621]"
              aria-expanded={isInfoOpen}
              aria-controls="upload-info-panel"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current text-[#d08b52]">
                <path d="M10 1.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5ZM8.875 7a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm.375 3h1.5v4h-1.5v-4Z" />
              </svg>
              {isInfoOpen ? "Hide info" : "Upload info"}
            </button>
            <div className="rounded-[8px] border border-[#4a433d] bg-[#25211d] px-3 py-2 text-sm text-[#d08b52]">
              {kind.limit}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <input
            ref={inputRef}
            type="file"
            accept={kind.acceptAttr}
            className="hidden"
            onChange={(event) => {
              void queueFile(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />

          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              void queueFile(event.dataTransfer.files?.[0] ?? null);
            }}
            className={`rounded-[10px] border border-dashed px-5 py-8 sm:px-8 sm:py-10 transition-colors ${
              isDragging
                ? "border-[#d08b52] bg-[#231d18]"
                : "border-[#6f5a45] bg-[#1b1815]"
            }`}
          >
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-[10px] border border-[#5a5047] bg-[#221d19] text-[#d08b52]">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-6 w-6 fill-current">
                  <path d="M10 2.5 5.5 7h2.75v5.75h3.5V7h2.75L10 2.5Zm-6 11.75v2.25h12v-2.25h1.5V18H2.5v-3.75H4Z" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#f7efe5]">Drop a file here</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#b9ada0]">
                Upload one {kind.title.toLowerCase()} file and get a public link immediately. The route accepts {kind.accept.toLowerCase()}.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                  className="relative inline-flex h-11 min-w-[168px] items-center justify-center overflow-hidden rounded-[8px] bg-[#d08b52] px-5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#e29d63] disabled:cursor-not-allowed disabled:bg-[#8d674a]"
                >
                  {isUploading ? (
                    <span
                      className="absolute inset-y-0 left-0 bg-[#f2d1ad]/55 transition-[width] duration-150 ease-linear"
                      style={{ width: `${uploadProgress}%` }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10">{isUploading ? `Uploading ${uploadProgress}%` : "Select file"}</span>
                </button>
                <span className="text-sm text-[#8f8478]">{kind.limit}</span>
              </div>
              <p className="mt-6 min-h-[24px] max-w-full break-all text-sm text-[#b9ada0]">
                {errorMessage ?? (pendingFile ? `${pendingFile.name} • ${formatFileSize(pendingFile.size)}` : `${kind.accept} • Automatic upload`)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {uploadedUrl ? <ShareLinkCard uploadedUrl={uploadedUrl} /> : null}

      {isInfoOpen ? (
        <section
          id="upload-info-panel"
          aria-labelledby="upload-info-title"
          className="rounded-[10px] border border-[#4a433d] bg-[#1a1714]"
        >
          <div className="border-b border-[#36312c] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="upload-info-title" className="text-lg font-semibold text-[#f7efe5]">
                  Upload info
                </h2>
                <p className="mt-1 text-sm text-[#b9ada0]">
                  Current state and route metadata.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                className="inline-flex h-9 items-center rounded-[8px] border border-[#4a433d] bg-[#25211d] px-3 text-sm text-[#f3efe8] transition-colors hover:border-[#6a6057] hover:bg-[#2b2621]"
              >
                Hide
              </button>
            </div>
          </div>
          <div className="p-5">
            <UploadInfoCards
              endpoint={kind.endpoint}
              accept={kind.accept}
              pendingFile={pendingFile}
              errorMessage={errorMessage}
              statusMessage={statusMessage}
              uploadProgress={uploadProgress}
            />
          </div>
        </section>
      ) : null}

      <section className="rounded-[10px] border border-[#36312c] bg-[#1f1c19] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[#f7efe5]">Service notes</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Access", "Public link after upload"],
            ["Mode", "Automatic upload"],
            ["Storage", "Managed by UploadThing"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-[#4a433d] bg-[#25211d] p-3">
              <dt className="text-xs text-[#b9ada0]">{label}</dt>
              <dd className="mt-1 text-sm text-[#f3efe8]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
