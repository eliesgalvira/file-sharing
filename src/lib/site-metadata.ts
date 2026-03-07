export const siteConfig = {
  applicationName: "File sharing",
  name: "File sharing",
  shortName: "Files",
  title: "Share your files with a link",
  description: "Upload files and generate a public link for sharing.",
  locale: "en_US",
  themeColor: "#1f1c19",
  backgroundColor: "#171717",
  foregroundColor: "#f7efe5",
  mutedColor: "#b9ada0",
  ogImage: "/og-card-v3.png",
  keywords: [
    "file sharing",
    "public uploads",
    "file links",
    "image uploads",
    "pdf uploads",
    "text uploads",
  ],
} as const;

function normalizeSiteUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  return new URL(candidate ? normalizeSiteUrl(candidate) : "http://localhost:3000");
}
