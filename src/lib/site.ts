import "server-only";
import fs from "node:fs";
import path from "node:path";
import { profile, type Resume } from "@/content/profile";

/**
 * The public origin of the site: NEXT_PUBLIC_SITE_URL if set, otherwise
 * `profile.siteUrl`. Vercel's own URL and localhost are last resorts, and the
 * /qr page warns about them because a printed code must never change.
 */
function resolveSiteUrl(): { url: string; source: "configured" | "vercel" | "local" } {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || profile.siteUrl;
  if (configured) return { url: configured.replace(/\/+$/, ""), source: "configured" };

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return { url: `https://${vercel}`, source: "vercel" };

  return { url: "http://localhost:3000", source: "local" };
}

const resolved = resolveSiteUrl();

export const siteUrl = resolved.url;
export const siteUrlSource = resolved.source;

/** The short, permanent path written to the NFC tag and encoded in the QR code. */
export const CARD_PATH = "/c";
export const cardUrl = `${siteUrl}${CARD_PATH}`;

const publicDir = path.join(process.cwd(), "public");

export function publicFileExists(file: string): boolean {
  return fs.existsSync(path.join(publicDir, file));
}

/** Resumes whose PDF is present, in priority order. */
export function availableResumes(): Resume[] {
  return profile.resumes.filter((resume) => publicFileExists(resume.file));
}

export function visibleLinks() {
  return profile.links.filter(
    (link): link is typeof link & { href: string } => Boolean(link.href),
  );
}
