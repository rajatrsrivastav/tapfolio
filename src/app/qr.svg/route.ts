import { cardQrSvg } from "@/lib/qr";

export async function GET() {
  return new Response(await cardQrSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": 'inline; filename="rajat-srivastav-qr.svg"',
    },
  });
}
