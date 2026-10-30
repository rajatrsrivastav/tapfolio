import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile-page";

// The permanent address written to the NFC card and QR code. It renders the
// profile directly instead of redirecting, so a tap costs one round trip.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Card() {
  return <ProfilePage />;
}
