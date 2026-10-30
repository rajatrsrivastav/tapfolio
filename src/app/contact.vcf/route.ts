import { profile } from "@/content/profile";
import { buildVCard } from "@/lib/vcard";

export function GET() {
  const fileName = `${profile.name.replace(/\s+/g, "-")}.vcf`;
  return new Response(buildVCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      // `inline` lets iOS Safari show its "Create New Contact" sheet directly;
      // Android and desktop browsers download the file with this name.
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
