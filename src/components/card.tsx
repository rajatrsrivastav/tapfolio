import type { CSSProperties, ReactNode } from "react";
import { profile } from "@/content/profile";

const z = (value: number) => ({ "--z": value }) as CSSProperties;

/** The engraved / glowing antenna: concentric loops wrapped around the chip. */
function Coil({ className, stroke, chip = true }: { className?: string; stroke: string; chip?: boolean }) {
  return (
    <svg viewBox="0 0 54 86" className={className} fill="none" aria-hidden preserveAspectRatio="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={5 + i * 2.2}
          y={7 + i * 2.2}
          width={44 - i * 4.4}
          height={72 - i * 4.4}
          rx={4 - i * 0.5}
          stroke={stroke}
          strokeWidth={0.32}
        />
      ))}
      {chip && (
        <>
          <rect x="21" y="36" width="12" height="9" rx="1.4" fill={stroke} fillOpacity={0.9} />
          <path d="M33 40.5h6.2M21 40.5h-6.2" stroke={stroke} strokeWidth={0.32} />
        </>
      )}
    </svg>
  );
}

function Chip() {
  return (
    <div
      aria-hidden
      className="absolute top-[40%] left-[11%] h-[8.6%] w-[17%] rounded-[18%] bg-[linear-gradient(135deg,#e6e9f0,#aab2c3_55%,#d9dde6)] shadow-[inset_0_0_0_0.5px_rgb(80_90_115/0.45)]"
    >
      <span className="absolute inset-x-0 top-1/2 h-px bg-[#7d879c]/50" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-[#7d879c]/50" />
      <span className="absolute inset-[26%] rounded-[2px] border border-[#7d879c]/40" />
    </div>
  );
}

/** Front of the card. Portrait, like a badge held up to a phone. */
export function CardFace({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`card-layer card-face ${className}`} style={style}>
      {/* Panel split and the accent blocks */}
      <span aria-hidden className="absolute inset-y-0 left-[64%] w-px bg-[#8e98ae]/30" />
      <span aria-hidden className="absolute top-[63%] right-0 left-0 h-px bg-[#8e98ae]/30" />
      <span aria-hidden className="absolute top-[24%] right-0 left-[64%] h-[19%] bg-[linear-gradient(160deg,#c3b8ff,#9f8cff)]" />
      <span aria-hidden className="absolute top-[43%] right-0 left-[64%] h-[9%] bg-[linear-gradient(160deg,#a9e7cc,#78cfaa)] opacity-80" />

      <Coil className="absolute inset-0 h-full w-full opacity-[0.16]" stroke="#3a4462" chip={false} />
      <Chip />

      {/* Wordmark along the top-left edge, name along the right edge */}
      <span
        aria-hidden
        className="font-wide absolute top-[6%] left-[7%] rotate-180 text-[calc(var(--card-w)*0.056)] leading-none font-extrabold tracking-[-0.01em] whitespace-nowrap text-[#1a2134] [writing-mode:vertical-rl]"
      >
        tapfolio
      </span>
      <span
        aria-hidden
        className="absolute right-[6%] bottom-[6%] rotate-180 text-[calc(var(--card-w)*0.034)] leading-none font-medium tracking-[0.34em] whitespace-nowrap text-[#2a3350] uppercase [writing-mode:vertical-rl]"
        style={{ fontVariationSettings: '"wdth" 112' }}
      >
        {profile.name}
      </span>
      <span
        aria-hidden
        className="absolute bottom-[4.5%] left-[8%] grid size-[calc(var(--card-w)*0.075)] place-items-center rounded-[22%] border border-[#2a3350]/60 text-[calc(var(--card-w)*0.032)] font-bold text-[#2a3350]"
      >
        RS
      </span>
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
      <Coil className="absolute inset-0 h-full w-full opacity-[0.12]" stroke="#b4a7ff" chip={false} />
      {children}
      <span className="card-sheen opacity-50" aria-hidden />
    </div>
  );
}

/** The four physical layers, stacked; the film pulls them apart. */
export function CardStack() {
  return (
    <div className="card-body">
      <CardBack className="layer-back" style={z(-1.5)} />
      <div className="card-layer card-core" style={z(-0.5)} />
      <div className="card-layer card-inlay layer-inlay" style={z(0.5)}>
        <Coil className="absolute inset-0 h-full w-full" stroke="#b4a7ff" />
      </div>
      <CardFace className="layer-face" style={z(1.5)} />
    </div>
  );
}

export const LAYER_Z: Record<"face" | "inlay" | "core" | "back", number> = {
  face: 1.5,
  inlay: 0.5,
  core: -0.5,
  back: -1.5,
};
