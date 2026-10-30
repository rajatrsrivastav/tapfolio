import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as icon.svg: a card antenna wrapped around its chip.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#131a28", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", width: 130, height: 106, borderRadius: 28, border: "7px solid rgba(180,167,255,0.45)", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 84, height: 66, borderRadius: 18, border: "7px solid rgba(180,167,255,0.75)", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 38, height: 26, borderRadius: 7, background: "#b4a7ff" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
