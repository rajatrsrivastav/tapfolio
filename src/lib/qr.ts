import "server-only";
import { cacheLife } from "next/cache";
import QRCode from "qrcode";
import { cardUrl } from "@/lib/site";

// Medium error correction keeps the code sparse enough to scan quickly from a
// badge in poor light; the 4-module quiet zone is the minimum the spec allows.
const options = { errorCorrectionLevel: "M", margin: 4 } as const;

/** Black-on-white SVG of the card URL, suitable for print. */
export function cardQrSvg(): Promise<string> {
  return QRCode.toString(cardUrl, {
    ...options,
    type: "svg",
    color: { dark: "#000000", light: "#ffffff" },
  });
}

/** High-resolution PNG of the card URL (about 1200px square), base64-encoded. */
export async function cardQrPngBase64(): Promise<string> {
  // The PNG encoder yields to the event loop, which would otherwise stop the
  // build from prerendering the route.
  "use cache";
  cacheLife("max");
  const png = await QRCode.toBuffer(cardUrl, {
    ...options,
    type: "png",
    width: 1200,
    color: { dark: "#000000", light: "#ffffff" },
  });
  return png.toString("base64");
}
