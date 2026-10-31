import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { profile, type CardLayer, type Channel } from "@/content/profile";
import { LinkIcon } from "@/components/icons";
import { publicFileExists } from "@/lib/site";

const z = (value: number) => ({ "--z": value }) as CSSProperties;

/**
 * Front of the personal card. Every size is in cqw (percent
 * of the card's width), so it scales with the card at any screen size.
 */
export function CardFace({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const hasPhoto = publicFileExists(profile.photo.src);
  const handle = profile.links
    .find((link) => link.kind === "github")
    ?.href?.replace(/^https?:\/\/(www\.)?github\.com\//, "@");

  return (
    <div className={`card-layer card-face ${className}`} style={style}>
      <div aria-hidden className="relative flex h-full flex-col p-[5.5cqw]">
        <div className="flex items-center justify-between">
          <span className="text-[2.6cqw] font-medium text-[#4d5480]">{profile.location}</span>
        </div>

        <div className="mt-auto flex items-end gap-[4cqw]">
          {hasPhoto && (
            <Image
              src={profile.photo.src}
              alt=""
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="120px"
              className="size-[22cqw] shrink-0 rounded-[3.4cqw] object-cover shadow-[0_0.6cqw_2cqw_rgb(40_30_120/0.25)] ring-[0.4cqw] ring-white/80"
            />
          )}
          <div className="min-w-0 pb-[0.6cqw]">
            <p className="font-wide text-[5.6cqw] leading-[0.98] font-extrabold tracking-[-0.02em] text-[#151a33]">
              {profile.givenName}
              <br />
              {profile.familyName}
            </p>
            <p className="mt-[1.4cqw] text-[2.9cqw] leading-tight font-medium text-[#2b3156]">{profile.role}</p>
            {handle && <p className="mt-[0.6cqw] text-[2.5cqw] leading-tight text-[#4d5480]">{handle}</p>}
          </div>
        </div>

        <div className="mt-[4cqw] flex items-center justify-between border-t border-[#5b4fc7]/25 pt-[2.2cqw]">
          <span className="text-[2.1cqw] font-medium text-[#4d5480]">{profile.siteUrl.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
      <span className="card-sheen" aria-hidden />
    </div>
  );
}

/** Graphite back. In the finale it carries the QR code. */
export function CardBack({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className={`card-layer card-graphite ${className}`} style={style}>
      {children}
      <span className="card-sheen opacity-50" aria-hidden />
    </div>
  );
}

/** The network logo printed on a lower layer, so the exploded view shows it. */
function LayerGlyph({ layer }: { layer: CardLayer }) {
  const kind = profile.channels.find((channel) => channel.layer === layer)?.kind as Channel["kind"] | undefined;
  if (!kind) return null;
  return (
    <LinkIcon
      kind={kind}
      className="absolute top-1/2 left-[38%] size-[13cqw] -translate-x-1/2 -translate-y-1/2 text-field opacity-90 drop-shadow-[0_0_2cqw_rgb(180_167_255/0.6)]"
    />
  );
}

/** The four physical layers, stacked; the film pulls them apart. */
export function CardStack() {
  return (
    <div className="card-body">
      <CardBack className="layer-back" style={z(-1.5)}>
        <LayerGlyph layer="back" />
      </CardBack>
      <div className="card-layer card-core" style={z(-0.5)}>
        <LayerGlyph layer="core" />
      </div>
      <div className="card-layer card-inlay layer-inlay" style={z(0.5)}>
        <LayerGlyph layer="inlay" />
      </div>
      <CardFace className="layer-face" style={z(1.5)} />
    </div>
  );
}

export const LAYER_Z: Record<CardLayer, number> = {
  face: 1.5,
  inlay: 0.5,
  core: -0.5,
  back: -1.5,
};
