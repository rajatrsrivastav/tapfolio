import { cardQrPngBase64 } from "@/lib/qr";

export async function GET() {
  return new Response(Buffer.from(await cardQrPngBase64(), "base64"), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'inline; filename="rajat-srivastav-qr.png"',
    },
  });
}
