import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import { headScript } from "@/components/intro";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const title = `${profile.name}, ${profile.role.toLowerCase()}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description: `${profile.headline}. ${profile.availability}.`,
  applicationName: "Tapfolio",
  authors: [{ name: profile.name, url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title,
    description: profile.headline,
    firstName: profile.givenName,
    lastName: profile.familyName,
    username: "rajatrsrivastav",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.headline,
    creator: "@rajatrsrivastav",
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#060a14",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The head script sets data-motion and data-intro before first paint.
    <html lang="en-IN" className={mona.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
