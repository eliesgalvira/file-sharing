"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UploadDropzone } from "~/utils/uploadthing";
import {
  designIds,
  type DesignId,
  type UploadKind,
  uploadKinds,
} from "~/lib/site-data";

type PendingFile = {
  name: string;
  size: string;
};

type UploadExperienceProps = {
  design: DesignId;
  kind?: UploadKind;
  basePath?: string;
};

type AppearancePreset = {
  shell: string;
  nav: string;
  navLink: string;
  navActive: string;
  panel: string;
  panelAlt: string;
  border: string;
  muted: string;
  button: string;
  buttonQuiet: string;
  success: string;
  dropzone: string;
  dropzoneButton: string;
  dropzoneLabel: string;
  dropzoneText: string;
  uploadIcon: string;
  body: string;
  heading: string;
  accent: string;
};

const appearances: Record<DesignId, AppearancePreset> = {
  "1": {
    shell: "min-h-screen bg-[#f3ede4] text-[#2f241b]",
    nav: "border-r border-[#d5c7b2] bg-[#ede3d5]",
    navLink: "border border-transparent text-[#5c4a39] hover:border-[#cdb89d] hover:bg-[#f8f2ea]",
    navActive: "border-[#8a6a45] bg-[#f8f2ea] text-[#2f241b]",
    panel: "border border-[#d5c7b2] bg-[#fffaf2]",
    panelAlt: "border border-[#d5c7b2] bg-[#f7efe2]",
    border: "border-[#d5c7b2]",
    muted: "text-[#6c5a49]",
    button: "bg-[#2f241b] text-[#fffaf2] hover:bg-[#47372a]",
    buttonQuiet: "border border-[#b59c7e] bg-[#fffaf2] text-[#2f241b] hover:bg-[#f3ede4]",
    success: "border border-[#bca88a] bg-[#efe2cd] text-[#2f241b]",
    dropzone: "border border-dashed border-[#b59c7e] bg-[#fffdf9]",
    dropzoneButton: "bg-[#2f241b] text-[#fffaf2] hover:bg-[#47372a]",
    dropzoneLabel: "text-[#2f241b]",
    dropzoneText: "text-[#6c5a49]",
    uploadIcon: "text-[#8a6a45]",
    body: "font-sans",
    heading: "text-[#2f241b]",
    accent: "text-[#8a6a45]",
  },
  "2": {
    shell: "min-h-screen bg-[#171717] text-[#f3efe8]",
    nav: "border-b border-[#36312c] bg-[#1f1c19]",
    navLink: "border border-transparent text-[#b9ada0] hover:border-[#4f463e] hover:bg-[#26211d]",
    navActive: "border-[#b67445] bg-[#2b241e] text-[#f7efe5]",
    panel: "border border-[#36312c] bg-[#1f1c19]",
    panelAlt: "border border-[#4a433d] bg-[#25211d]",
    border: "border-[#36312c]",
    muted: "text-[#b9ada0]",
    button: "bg-[#d08b52] text-[#171717] hover:bg-[#e29d63]",
    buttonQuiet: "border border-[#5a5047] bg-transparent text-[#f3efe8] hover:bg-[#26211d]",
    success: "border border-[#6f5a45] bg-[#2a241f] text-[#f3efe8]",
    dropzone: "border border-dashed border-[#6f5a45] bg-[#1b1815]",
    dropzoneButton: "bg-[#d08b52] text-[#171717] hover:bg-[#e29d63]",
    dropzoneLabel: "text-[#f3efe8]",
    dropzoneText: "text-[#b9ada0]",
    uploadIcon: "text-[#d08b52]",
    body: "font-sans",
    heading: "text-[#f7efe5]",
    accent: "text-[#d08b52]",
  },
  "3": {
    shell: "min-h-screen bg-[#f5f6f2] text-[#18201b]",
    nav: "border-r border-[#cdd2c6] bg-[#ebece5]",
    navLink: "border border-transparent text-[#445047] hover:border-[#b7beb4] hover:bg-[#f6f7f3]",
    navActive: "border-[#5b705e] bg-[#f6f7f3] text-[#18201b]",
    panel: "border border-[#cdd2c6] bg-[#ffffff]",
    panelAlt: "border border-[#cdd2c6] bg-[#f0f2ec]",
    border: "border-[#cdd2c6]",
    muted: "text-[#5a665d]",
    button: "bg-[#20352a] text-[#f5f6f2] hover:bg-[#2c4738]",
    buttonQuiet: "border border-[#aab3a8] bg-[#ffffff] text-[#18201b] hover:bg-[#f0f2ec]",
    success: "border border-[#aeb7ab] bg-[#edf1ea] text-[#18201b]",
    dropzone: "border border-dashed border-[#aab3a8] bg-[#fcfcfa]",
    dropzoneButton: "bg-[#20352a] text-[#f5f6f2] hover:bg-[#2c4738]",
    dropzoneLabel: "text-[#18201b]",
    dropzoneText: "text-[#5a665d]",
    uploadIcon: "text-[#5b705e]",
    body: "font-sans",
    heading: "text-[#18201b]",
    accent: "text-[#5b705e]",
  },
};

function versionHref(design: DesignId, slug?: string) {
  return slug ? `/${design}/${slug}` : `/${design}`;
}

function directHref(basePath: string, slug?: string) {
  return slug ? `${basePath}/${slug}` : basePath;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function UploadExperience({ design, kind, basePath = "" }: UploadExperienceProps) {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const style = appearances[design];
  const activeSlug = kind?.slug;

  const summaryRows = useMemo(
    () => [
      ["Access", "Public link after upload"],
      ["Mode", "Automatic upload"],
      ["Retention", "Managed by UploadThing"],
    ],
    [],
  );

  const dropzoneAppearance = design === "2"
    ? {
        container: ({ isDragActive, isUploading }: { isDragActive: boolean; isUploading: boolean }) =>
          `${style.dropzone} min-h-[320px] rounded-[10px] px-6 py-8 transition-colors ${
            isDragActive ? "border-[#d08b52] bg-[#231d18]" : ""
          } ${isUploading ? "border-[#9a714f] bg-[#211b16]" : ""}`,
        uploadIcon: "h-10 w-10 text-[#d08b52]",
        label: `${style.dropzoneLabel} min-h-[52px] text-center text-xl font-semibold`,
        allowedContent: `${style.dropzoneText} min-h-[44px] text-center text-sm leading-6`,
        button: `${style.dropzoneButton} inline-flex h-11 w-[148px] items-center justify-center rounded-[8px] text-sm font-medium transition-colors`,
      }
    : {
        container: `${style.dropzone} min-h-[240px] rounded-[10px] p-6 transition-colors`,
        uploadIcon: `${style.uploadIcon} h-5 w-5`,
        label: `${style.dropzoneLabel} text-sm font-medium`,
        allowedContent: `${style.dropzoneText} text-xs`,
        button: `${style.dropzoneButton} rounded-[8px] px-4 py-2 text-sm font-medium transition-colors`,
      };

  const dropzoneContent = design === "2"
    ? {
        label: () => (
          <div className="space-y-1">
            <div>{`Drop a ${kind?.title.toLowerCase()} file here`}</div>
            <div className="text-sm font-normal text-[#b9ada0]">or browse from your device</div>
          </div>
        ),
        allowedContent: () => {
          if (errorMessage) {
            return errorMessage;
          }

          if (uploadProgress > 0 && uploadProgress < 100) {
            return `${pendingFile?.name ?? "Upload in progress"} • ${uploadProgress}% complete`;
          }

          if (pendingFile) {
            return `${pendingFile.name} • ${pendingFile.size}`;
          }

          return `${kind?.accept} • ${kind?.limit}`;
        },
        button: () => "Select file",
      }
    : {
        label: () => `Choose a ${kind?.title.toLowerCase()} file or drop it here`,
        allowedContent: () => `${kind?.accept} • ${kind?.limit}`,
        button: ({ isUploading }: { isUploading: boolean }) => (isUploading ? "Uploading" : "Select file"),
      };

  const content = kind ? (
    <UploadDropzone
      endpoint={kind.endpoint}
      className="w-full"
      appearance={dropzoneAppearance}
      content={dropzoneContent}
      onBeforeUploadBegin={(files) => files}
      onChange={(files) => {
        const file = files[0];
        setUploadedFileUrl(null);
        setErrorMessage(null);
        setUploadProgress(0);
        setStatusMessage(file ? "Ready to upload" : null);
        setPendingFile(file ? { name: file.name, size: formatFileSize(file.size) } : null);
      }}
      onClientUploadComplete={(res) => {
        setUploadProgress(100);
        setStatusMessage("Upload complete");
        setUploadedFileUrl(res[0]?.ufsUrl ?? null);
      }}
      onUploadError={(error: Error) => {
        setUploadProgress(0);
        setStatusMessage(null);
        setErrorMessage(error.message);
      }}
      onUploadBegin={(fileName) => {
        setPendingFile((current) => current ?? { name: fileName, size: "Pending" });
        setStatusMessage("Uploading");
        setErrorMessage(null);
        setUploadProgress(0);
        setUploadedFileUrl(null);
      }}
      onUploadAborted={() => {
        setStatusMessage("Upload canceled");
        setUploadProgress(0);
      }}
      onUploadProgress={(progress) => {
        setUploadProgress(progress);
      }}
      uploadProgressGranularity="fine"
      config={{ mode: "auto" }}
    />
  ) : null;

  if (design === "2") {
    return (
      <div className={`${style.shell} ${style.body}`}>
        <header className={`${style.nav}`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div>
              <h1 className={`text-xl font-semibold ${style.heading}`}>File sharing</h1>
              <p className={`mt-1 text-sm ${style.muted}`}>Simple public uploads, organized by file type.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {designIds.map((id) => (
                <Link
                  key={id}
                  href={versionHref(id, activeSlug)}
                  className={`rounded-[8px] px-3 py-2 transition-colors ${id === design ? style.navActive : style.navLink}`}
                >
                  Version {id}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          <aside className={`${style.panel} rounded-[10px] p-3`}>
            <nav className="space-y-1">
              <Link href={basePath || "/"} className={`block rounded-[8px] px-3 py-2 text-sm transition-colors ${!activeSlug ? style.navActive : style.navLink}`}>
                All upload types
              </Link>
              {uploadKinds.map((entry) => (
                <Link
                  key={entry.slug}
                  href={directHref(basePath, entry.slug)}
                  className={`block rounded-[8px] px-3 py-2 text-sm transition-colors ${activeSlug === entry.slug ? style.navActive : style.navLink}`}
                >
                  {entry.title}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="grid gap-6">
            {kind ? (
              <>
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className={`${style.panel} rounded-[10px] p-6`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className={`text-2xl font-semibold ${style.heading}`}>{kind.title} upload</h2>
                        <p className={`mt-2 text-sm ${style.muted}`}>{kind.description}</p>
                      </div>
                      <div className={`${style.panelAlt} rounded-[8px] px-3 py-2 text-sm ${style.accent}`}>{kind.limit}</div>
                    </div>
                    <div className="mt-6">{content}</div>
                  </div>

                  <aside className="grid gap-6">
                    <div className={`${style.panelAlt} rounded-[10px] p-5`}>
                      <h3 className={`text-base font-semibold ${style.heading}`}>Current upload</h3>
                      <dl className="mt-4 grid gap-4 text-sm">
                        <div>
                          <dt className={style.muted}>File</dt>
                          <dd className="mt-1 break-all">{pendingFile?.name ?? "No file selected"}</dd>
                        </div>
                        <div>
                          <dt className={style.muted}>Status</dt>
                          <dd className="mt-1">{errorMessage ?? statusMessage ?? "Waiting for selection"}</dd>
                        </div>
                        <div>
                          <dt className={style.muted}>Progress</dt>
                          <dd className="mt-1">{uploadProgress}%</dd>
                        </div>
                      </dl>
                      <div className="mt-4 h-2 overflow-hidden rounded-[999px] bg-[#312a24]">
                        <div
                          className="h-full bg-[#d08b52] transition-[width] duration-150 ease-linear"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      {uploadedFileUrl && (
                        <div className={`${style.success} mt-4 rounded-[10px] p-4`}>
                          <p className="text-sm font-medium">Share link</p>
                          <a href={uploadedFileUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm underline underline-offset-2">
                            {uploadedFileUrl}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className={`${style.panelAlt} rounded-[10px] p-5`}>
                      <h3 className={`text-base font-semibold ${style.heading}`}>Route details</h3>
                      <dl className="mt-4 grid gap-4 text-sm">
                        <div>
                          <dt className={style.muted}>Accepted content</dt>
                          <dd className="mt-1">{kind.accept}</dd>
                        </div>
                        <div>
                          <dt className={style.muted}>Endpoint</dt>
                          <dd className="mt-1 font-mono text-xs">{kind.endpoint}</dd>
                        </div>
                        <div>
                          <dt className={style.muted}>Mode</dt>
                          <dd className="mt-1">Automatic upload after selection</dd>
                        </div>
                      </dl>
                    </div>
                  </aside>
                </div>

                <div className={`${style.panel} rounded-[10px] p-6`}>
                  <h3 className={`text-base font-semibold ${style.heading}`}>Service notes</h3>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                    {summaryRows.map(([label, value]) => (
                      <div key={label} className={`${style.panelAlt} rounded-[8px] p-3`}>
                        <dt className={`text-xs ${style.muted}`}>{label}</dt>
                        <dd className="mt-1 text-sm">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </>
            ) : (
              <div className={`${style.panel} rounded-[10px] p-6`}>
                <h2 className={`text-2xl font-semibold ${style.heading}`}>Choose an upload type</h2>
                <div className="mt-6 overflow-hidden rounded-[10px] border border-[#36312c]">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[#221f1b] text-[#b9ada0]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Accepted content</th>
                        <th className="px-4 py-3 font-medium">Limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadKinds.map((entry) => (
                        <tr key={entry.slug} className="border-t border-[#36312c]">
                          <td className="px-4 py-3">
                            <Link href={directHref(basePath, entry.slug)} className="underline underline-offset-2">
                              {entry.title}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-[#b9ada0]">{entry.description}</td>
                          <td className="px-4 py-3 text-[#b9ada0]">{entry.limit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  if (design === "3") {
    return (
      <div className={`${style.shell} ${style.body}`}>
        <div className="grid min-h-screen lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className={`${style.nav} px-4 py-5`}>
            <div className="px-2">
              <h1 className={`text-lg font-semibold ${style.heading}`}>File sharing</h1>
              <p className={`mt-1 text-sm ${style.muted}`}>Uploads by type</p>
            </div>
            <nav className="mt-6 space-y-1">
              <Link href={basePath || "/"} className={`block rounded-[8px] px-3 py-2 text-sm transition-colors ${!activeSlug ? style.navActive : style.navLink}`}>
                Overview
              </Link>
              {uploadKinds.map((entry) => (
                <Link
                  key={entry.slug}
                  href={directHref(basePath, entry.slug)}
                  className={`block rounded-[8px] px-3 py-2 text-sm transition-colors ${activeSlug === entry.slug ? style.navActive : style.navLink}`}
                >
                  {entry.title}
                </Link>
              ))}
            </nav>
            <div className={`mt-6 rounded-[10px] ${style.panelAlt} p-3`}>
              <p className="text-sm font-medium">Versions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {designIds.map((id) => (
                  <Link
                    key={id}
                    href={versionHref(id, activeSlug)}
                    className={`rounded-[8px] px-3 py-2 text-sm transition-colors ${id === design ? style.navActive : style.navLink}`}
                  >
                    {id}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <main className="px-5 py-6 sm:px-8">
            {kind ? (
              <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <section className={`${style.panel} rounded-[10px] p-6`}>
                  <div className="flex items-start justify-between gap-4 border-b border-[#d7dbd0] pb-4">
                    <div>
                      <h2 className={`text-2xl font-semibold ${style.heading}`}>{kind.title} upload</h2>
                      <p className={`mt-2 text-sm ${style.muted}`}>{kind.description}</p>
                    </div>
                    <div className={`rounded-[8px] ${style.panelAlt} px-3 py-2 text-sm`}>{kind.limit}</div>
                  </div>
                  <div className="mt-6">{content}</div>
                  {uploadedFileUrl && (
                    <div className={`${style.success} mt-6 rounded-[10px] p-4`}>
                      <p className="text-sm font-medium">Share link</p>
                      <a href={uploadedFileUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm underline underline-offset-2">
                        {uploadedFileUrl}
                      </a>
                    </div>
                  )}
                </section>

                <aside className="grid gap-6">
                  <div className={`${style.panel} rounded-[10px] p-5`}>
                    <h3 className={`text-base font-semibold ${style.heading}`}>This route</h3>
                    <dl className="mt-4 grid gap-3 text-sm">
                      <div>
                        <dt className={style.muted}>Endpoint</dt>
                        <dd className="mt-1 font-mono">{kind.endpoint}</dd>
                      </div>
                      <div>
                        <dt className={style.muted}>Allowed content</dt>
                        <dd className="mt-1">{kind.accept}</dd>
                      </div>
                      <div>
                        <dt className={style.muted}>Size limit</dt>
                        <dd className="mt-1">{kind.limit}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className={`${style.panel} rounded-[10px] p-5`}>
                    <h3 className={`text-base font-semibold ${style.heading}`}>Other routes</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                      {uploadKinds.filter((entry) => entry.slug !== activeSlug).map((entry) => (
                        <li key={entry.slug}>
                          <Link href={directHref(basePath, entry.slug)} className="underline underline-offset-2">
                            {entry.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {uploadKinds.map((entry) => (
                  <Link key={entry.slug} href={directHref(basePath, entry.slug)} className={`${style.panel} rounded-[10px] p-5 transition-colors hover:bg-[#f0f2ec]`}>
                    <h2 className={`text-lg font-semibold ${style.heading}`}>{entry.title}</h2>
                    <p className={`mt-2 text-sm ${style.muted}`}>{entry.description}</p>
                    <p className="mt-4 text-sm">{entry.limit}</p>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`${style.shell} ${style.body}`}>
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className={`${style.nav} px-4 py-5`}>
          <div className="px-2">
            <h1 className={`text-lg font-semibold ${style.heading}`}>File sharing</h1>
            <p className={`mt-1 text-sm ${style.muted}`}>Public links for common file formats</p>
          </div>
          <nav className="mt-6 space-y-1">
            <Link href={basePath || "/"} className={`block rounded-[8px] px-3 py-2 text-sm transition-colors ${!activeSlug ? style.navActive : style.navLink}`}>
              All upload types
            </Link>
            {uploadKinds.map((entry) => (
              <Link
                key={entry.slug}
                href={directHref(basePath, entry.slug)}
                className={`block rounded-[8px] px-3 py-2 text-sm transition-colors ${activeSlug === entry.slug ? style.navActive : style.navLink}`}
              >
                {entry.title}
              </Link>
            ))}
          </nav>
          <div className={`mt-6 rounded-[10px] ${style.panelAlt} p-3`}>
            <p className="text-sm font-medium">Switch redesign</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {designIds.map((id) => (
                <Link
                  key={id}
                  href={versionHref(id, activeSlug)}
                  className={`rounded-[8px] px-3 py-2 text-sm transition-colors ${id === design ? style.navActive : style.navLink}`}
                >
                  Version {id}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="px-5 py-6 sm:px-8">
          {kind ? (
            <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <section className={`${style.panel} rounded-[10px] p-6`}>
                <div className="border-b border-[#d5c7b2] pb-4">
                  <h2 className={`text-2xl font-semibold ${style.heading}`}>{kind.title} upload</h2>
                  <p className={`mt-2 text-sm ${style.muted}`}>{kind.description}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <div className={`${style.panelAlt} rounded-[8px] px-3 py-2`}>{kind.limit}</div>
                  <div className={`${style.panelAlt} rounded-[8px] px-3 py-2`}>{kind.accept}</div>
                </div>
                <div className="mt-6">{content}</div>
                {uploadedFileUrl && (
                  <div className={`${style.success} mt-6 rounded-[10px] p-4`}>
                    <p className="text-sm font-medium">Upload complete</p>
                    <a href={uploadedFileUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm underline underline-offset-2">
                      {uploadedFileUrl}
                    </a>
                  </div>
                )}
              </section>

              <aside className="grid gap-6">
                <div className={`${style.panel} rounded-[10px] p-5`}>
                  <h3 className={`text-base font-semibold ${style.heading}`}>Before you upload</h3>
                  <ul className={`mt-4 space-y-3 text-sm ${style.muted}`}>
                    <li>Files are uploaded directly and a public URL is returned when the transfer finishes.</li>
                    <li>Choose the route that matches the file type so the backend can apply the correct limit.</li>
                    <li>Use the version switcher in the left rail to compare all three redesigns on the same route.</li>
                  </ul>
                </div>
                <div className={`${style.panel} rounded-[10px] p-5`}>
                  <h3 className={`text-base font-semibold ${style.heading}`}>Available routes</h3>
                  <div className="mt-4 grid gap-2 text-sm">
                    {uploadKinds.map((entry) => (
                      <Link key={entry.slug} href={directHref(basePath, entry.slug)} className="underline underline-offset-2">
                        {entry.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="mx-auto max-w-6xl">
              <div className={`${style.panel} rounded-[10px] p-6`}>
                <h2 className={`text-2xl font-semibold ${style.heading}`}>Select a route</h2>
                <p className={`mt-2 text-sm ${style.muted}`}>Each route keeps the same upload behavior, with a different interface treatment in versions 1, 2, and 3.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {uploadKinds.map((entry) => (
                    <Link key={entry.slug} href={directHref(basePath, entry.slug)} className={`${style.panelAlt} rounded-[10px] p-4 transition-colors hover:bg-[#fbf6ee]`}>
                      <h3 className={`text-lg font-semibold ${style.heading}`}>{entry.title}</h3>
                      <p className={`mt-2 text-sm ${style.muted}`}>{entry.description}</p>
                      <p className="mt-4 text-sm">{entry.limit}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
