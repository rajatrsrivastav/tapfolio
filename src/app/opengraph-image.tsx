import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";

export const alt = `${profile.name}, ${profile.headline.toLowerCase()}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const [wide, medium, photo] = await Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/MonaSans-ExpandedExtraBold.woff")),
  readFile(join(process.cwd(), "src/assets/fonts/MonaSans-Medium.woff")),
  readFile(join(process.cwd(), "public", profile.photo.src)),
]);

function coilSvg() {
  const loops = Array.from({ length: 7 }, (_, i) => {
    const k = i + 1;
    const w = 220 + 70 * k;
    const h = 220 + 44 * k;
    return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${40 + 10 * k}" stroke="#b4a7ff" stroke-opacity="${(0.62 - k * 0.075).toFixed(2)}" stroke-width="2.5" fill="none"/>`;
  }).join("");
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="660" viewBox="-380 -330 760 660">${loops}</svg>`,
  )}`;
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#060a14", position: "relative" }}>
        <img src={coilSvg()} width={760} height={660} alt="" style={{ position: "absolute", left: -130, top: -15 }} />
        <img
          src={`data:image/jpeg;base64,${photo.toString("base64")}`}
          width={220}
          height={220}
          alt=""
          style={{ position: "absolute", left: 140, top: 205, borderRadius: 40, border: "3px solid rgba(180,167,255,0.5)" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "absolute",
            left: 520,
            right: 64,
            top: 0,
            bottom: 0,
          }}
        >
          <div style={{ fontFamily: "Mona Wide", fontSize: 78, lineHeight: 0.98, color: "#e8edf5", letterSpacing: -1.5, display: "flex", flexDirection: "column" }}>
            <span>{profile.givenName}</span>
            <span>{profile.familyName}</span>
          </div>
          <div style={{ fontFamily: "Mona", fontSize: 32, lineHeight: 1.3, color: "#e8edf5", marginTop: 28 }}>
            {profile.headline}
          </div>
          <div style={{ fontFamily: "Mona", fontSize: 26, color: "#94a1b6", marginTop: 26, display: "flex" }}>
            {siteUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Mona Wide", data: wide, weight: 800, style: "normal" },
        { name: "Mona", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
