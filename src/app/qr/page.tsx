import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { DownloadIcon } from "@/components/icons";
import { cardQrSvg } from "@/lib/qr";
import { cardUrl, siteUrlSource } from "@/lib/site";

export const metadata: Metadata = {
  title: "QR code",
  robots: { index: false, follow: false },
};

const warnings: Record<typeof siteUrlSource, string | null> = {
  configured: null,
  vercel:
    "This code uses the Vercel production URL. If you plan to move to a custom domain, set NEXT_PUBLIC_SITE_URL first so the printed code never changes.",
  local:
    "This code points to localhost and will not work on other phones. Set NEXT_PUBLIC_SITE_URL to the public HTTPS address and rebuild before printing.",
};

export default async function QrPage() {
  const svg = await cardQrSvg();
  const warning = warnings[siteUrlSource];

  return (
    <main className="mx-auto grid min-h-dvh max-w-3xl content-start gap-10 px-5 py-10 sm:px-8 sm:py-16">
      <div>
        <Link href="/" className="inline-flex min-h-11 items-center text-[14.5px] text-fog hover:text-paper">
          Back to profile
        </Link>
        <h1 className="font-wide mt-4 text-[clamp(2rem,7vw,2.75rem)] leading-none font-extrabold">QR code</h1>
        <p className="mt-3 max-w-[34rem] text-[15.5px] leading-relaxed text-fog">
          Print this next to your NFC card. It opens the same address as the tag, so iPhones that can’t read the card still
          reach {profile.givenName}’s page.
        </p>
      </div>

      {warning && (
        <p role="alert" className="rounded-xl border border-[#e9b872]/50 bg-[#e9b872]/10 px-4 py-3 text-[14.5px] leading-relaxed text-[#f3d3a4]">
          {warning}
        </p>
      )}

      <div className="grid items-start gap-8 sm:grid-cols-[minmax(0,18rem)_1fr]">
        <div
          role="img"
          aria-label={`QR code that opens ${cardUrl}`}
          className="aspect-square w-full max-w-72 overflow-hidden rounded-2xl bg-white [&_svg]:size-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        <div className="grid gap-6">
          <div>
            <p className="text-[13px] text-fog">Encoded address</p>
            <p className="mt-1 text-[18px] font-medium break-all text-paper">{cardUrl}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href="/qr.svg"
              download="rajat-srivastav-qr.svg"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-field px-5 font-semibold text-night hover:bg-[#c4b9ff]"
            >
              <DownloadIcon />
              Download SVG
            </a>
            <a
              href="/qr.png"
              download="rajat-srivastav-qr.png"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-rule bg-panel px-5 font-medium hover:bg-[#222c41]"
            >
              <DownloadIcon />
              Download PNG
            </a>
          </div>

          <ul className="grid gap-2 text-[14.5px] leading-relaxed text-fog">
            <li>Print at least 2.5 cm wide, black on white. Keep the white border: scanners need it.</li>
            <li>Use the SVG for print shops and the PNG (1200 px) for slides or a phone wallpaper.</li>
            <li>Write exactly this address to the NFC tag as a URL record.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
