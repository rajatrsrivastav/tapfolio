import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Resumes contain contact details: keep them out of search results, and
        // always revalidate so a replaced PDF shows up immediately.
        source: "/resumes/:file*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      ...["/qr", "/qr.svg", "/qr.png", "/contact.vcf"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      })),
    ];
  },
};

export default nextConfig;
