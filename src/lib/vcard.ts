import "server-only";
import fs from "node:fs";
import path from "node:path";
import { profile } from "@/content/profile";
import { siteUrl, visibleLinks } from "@/lib/site";

/** Escape a vCard 3.0 text value (RFC 2426 §4). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Fold lines longer than 75 octets, as iOS and Android importers expect. */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Never split a multi-byte UTF-8 character.
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74; // continuation lines start with a space
  }
  return parts.join("\r\n ");
}

function readPhoto(): string | null {
  const file = path.join(process.cwd(), "src/assets/vcard-photo.jpg");
  return fs.existsSync(file) ? fs.readFileSync(file).toString("base64") : null;
}

export function buildVCard(): string {
  const phone = process.env.CONTACT_PHONE?.trim();
  const photo = readPhoto();

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeText(profile.familyName)};${escapeText(profile.givenName)};;;`,
    `FN:${escapeText(profile.name)}`,
    `TITLE:${escapeText(profile.role)}`,
    `EMAIL;TYPE=INTERNET,PREF:${profile.email}`,
    ...(phone ? [`TEL;TYPE=CELL:${phone}`] : []),
    `URL:${siteUrl}`,
    ...visibleLinks().flatMap((link, index) => [
      `item${index + 1}.URL:${link.href}`,
      `item${index + 1}.X-ABLabel:${escapeText(link.label)}`,
    ]),
    `NOTE:${escapeText(`${profile.headline}. Profile and resume: ${siteUrl}`)}`,
    ...(photo ? [`PHOTO;ENCODING=b;TYPE=JPEG:${photo}`] : []),
    "END:VCARD",
  ];

  return lines.map(fold).join("\r\n") + "\r\n";
}
